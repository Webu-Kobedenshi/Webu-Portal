import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { resolveProfileVisibility } from "../../domain/alumni-profile-policy";
import { resolveRoleAndStatus } from "../../domain/user-role-transition";
import { AlumniRepository } from "../../infrastructure/alumni.repository";
import { StorageService } from "../../infrastructure/storage.service";
import type { AlumniProfileDto, UserDto } from "../dto/alumni.dto";
import type {
  InitialSettingsInput,
  UpdateAlumniProfileInput,
  UploadUrlResponse,
} from "../dto/alumni.input";

@Injectable()
export class AlumniCommandService {
  constructor(
    @Inject(AlumniRepository) private readonly alumniRepository: AlumniRepository,
    @Inject(StorageService) private readonly storageService: StorageService,
  ) { }

  updateInitialSettings(userId: string, input: InitialSettingsInput): Promise<UserDto> {
    const name = input.name.trim();
    if (!name) {
      throw new BadRequestException("name is required");
    }

    const studentId = input.studentId.trim();
    if (!studentId) {
      throw new BadRequestException("studentId is required");
    }

    const currentYear = new Date().getFullYear();
    if (input.enrollmentYear < 2000 || input.enrollmentYear > currentYear + 1) {
      throw new BadRequestException("enrollmentYear is out of range");
    }

    if (![2, 3, 4].includes(input.durationYears)) {
      throw new BadRequestException("durationYears must be one of 2, 3, 4");
    }

    const { role, status } = resolveRoleAndStatus({
      enrollmentYear: input.enrollmentYear,
      durationYears: input.durationYears,
    });

    return this.alumniRepository.updateInitialSettings(userId, {
      ...input,
      name,
      studentId,
      role,
      status,
    });
  }

  deleteMyAccount(userId: string): Promise<boolean> {
    return this.alumniRepository.deleteUserById(userId);
  }

  async updateAlumniProfile(
    userId: string,
    input: UpdateAlumniProfileInput,
  ): Promise<AlumniProfileDto> {
    const user = await this.alumniRepository.findUserById(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const companyNames = Array.from(
      new Set(input.companyNames.map((item) => item.trim()).filter((item) => item.length > 0)),
    );

    const { isPublic, acceptContact } = resolveProfileVisibility({
      isPublic: input.isPublic,
      acceptContact: input.acceptContact,
    });
    const contactEmail = input.contactEmail?.trim() || user.email;

    if (isPublic && companyNames.length === 0) {
      throw new BadRequestException(
        "companyNames must contain at least one item when isPublic is true",
      );
    }

    return this.alumniRepository.upsertAlumniProfile(userId, {
      ...input,
      companyNames,
      contactEmail,
      isPublic,
      acceptContact: isPublic ? acceptContact : false,
    });
  }

  getUploadUrl(userId: string, fileName: string, contentType: string): Promise<UploadUrlResponse> {
    const normalizedFileName = fileName.trim();
    const normalizedContentType = contentType.trim();

    if (!normalizedFileName) {
      throw new BadRequestException("fileName is required");
    }

    if (!normalizedContentType) {
      throw new BadRequestException("contentType is required");
    }

    if (!normalizedContentType.startsWith("image/")) {
      throw new BadRequestException("contentType must be image/*");
    }

    return this.storageService.createPutUploadUrl({
      userId,
      fileName: normalizedFileName,
      contentType: normalizedContentType,
    });
  }

  async updateAvatar(userId: string, url: string): Promise<AlumniProfileDto> {
    const normalizedUrl = url.trim();
    if (!normalizedUrl) {
      throw new BadRequestException("url is required");
    }

    // Fetch the existing avatarUrl before overwriting it
    const existing = await this.alumniRepository.findUserById(userId);
    const oldAvatarUrl = existing?.alumniProfile?.avatarUrl ?? null;

    const updated = await this.alumniRepository.updateAvatarUrl(userId, normalizedUrl);
    if (!updated) {
      throw new BadRequestException("Alumni profile not found");
    }

    // Physically delete the old avatar from R2 (best-effort, non-fatal)
    if (oldAvatarUrl) {
      const key = this.storageService.extractKeyFromUrl(oldAvatarUrl);
      if (key) {
        this.storageService.deleteObject(key).catch((err: unknown) => {
          console.error("[StorageService] Failed to delete old avatar:", key, err);
        });
      }
    }

    return updated;
  }
}

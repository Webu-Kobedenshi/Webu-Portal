import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { resolveProfileVisibility } from "../../domain/alumni-profile-policy";
import type { Department } from "../../domain/types/department";
import { resolveRoleAndStatus } from "../../domain/user-role-transition";
import { AlumniRepository } from "../../infrastructure/alumni.repository";
import type { AlumniProfileDto, UserDto } from "../dto/alumni.dto";

type InitialSettingsInput = {
  name: string;
  studentId: string;
  enrollmentYear: number;
  durationYears: number;
  department: Department;
};

type UpdateAlumniProfileInput = {
  nickname?: string;
  graduationYear: number;
  department: Department;
  companyNames: string[];
  remarks?: string;
  contactEmail?: string;
  isPublic?: boolean;
  acceptContact?: boolean;
};

@Injectable()
export class AlumniCommandService {
  constructor(@Inject(AlumniRepository) private readonly alumniRepository: AlumniRepository) {}

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

    if (companyNames.length === 0) {
      throw new BadRequestException("companyNames must contain at least one item");
    }

    const { isPublic, acceptContact } = resolveProfileVisibility({
      isPublic: input.isPublic,
      acceptContact: input.acceptContact,
    });

    return this.alumniRepository.upsertAlumniProfile(userId, {
      ...input,
      companyNames,
      isPublic,
      acceptContact,
    });
  }
}

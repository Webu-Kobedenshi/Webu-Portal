import { Injectable } from "@nestjs/common";
import { resolveProfileVisibility } from "../../domain/alumni-profile-policy";
import type { Department } from "../../domain/types/department";
import { resolveRoleAndStatus } from "../../domain/user-role-transition";
import type { AlumniRepository } from "../../infrastructure/alumni.repository";
import type { AlumniProfileDto, UserDto } from "../dto/alumni.dto";

type InitialSettingsInput = {
  studentId: string;
  enrollmentYear: number;
  durationYears: number;
  department: Department;
};

type UpdateAlumniProfileInput = {
  nickname?: string;
  graduationYear: number;
  department: Department;
  companyName: string;
  remarks?: string;
  contactEmail?: string;
  isPublic?: boolean;
  acceptContact?: boolean;
};

@Injectable()
export class AlumniCommandService {
  constructor(private readonly alumniRepository: AlumniRepository) {}

  updateInitialSettings(userId: string, input: InitialSettingsInput): Promise<UserDto> {
    const { role, status } = resolveRoleAndStatus({
      enrollmentYear: input.enrollmentYear,
      durationYears: input.durationYears,
    });

    return this.alumniRepository.updateInitialSettings(userId, {
      ...input,
      role,
      status,
    });
  }

  updateAlumniProfile(userId: string, input: UpdateAlumniProfileInput): Promise<AlumniProfileDto> {
    const { isPublic, acceptContact } = resolveProfileVisibility({
      isPublic: input.isPublic,
      acceptContact: input.acceptContact,
    });

    return this.alumniRepository.upsertAlumniProfile(userId, {
      ...input,
      isPublic,
      acceptContact,
    });
  }
}

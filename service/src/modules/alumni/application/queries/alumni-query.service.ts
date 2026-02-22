import { Inject, Injectable } from "@nestjs/common";
import type { Department } from "../../domain/types/department";
import { resolveRoleAndStatus } from "../../domain/user-role-transition";
import { AlumniRepository } from "../../infrastructure/alumni.repository";
import type { AlumniConnectionDto, AlumniProfileDto, UserDto } from "../dto/alumni.dto";

@Injectable()
export class AlumniQueryService {
  constructor(@Inject(AlumniRepository) private readonly alumniRepository: AlumniRepository) {}

  getAlumniList(params: {
    department?: Department;
    company?: string;
    graduationYear?: number;
    limit: number;
    offset: number;
  }): Promise<AlumniConnectionDto> {
    return this.alumniRepository.findPublicList(params);
  }

  getAlumniDetail(id: string): Promise<AlumniProfileDto | null> {
    return this.alumniRepository.findPublicById(id);
  }

  async getMyProfile(userId: string): Promise<UserDto | null> {
    const profile = await this.alumniRepository.findUserById(userId);
    if (!profile) {
      return null;
    }

    if (profile.enrollmentYear && profile.durationYears) {
      const resolved = resolveRoleAndStatus({
        enrollmentYear: profile.enrollmentYear,
        durationYears: profile.durationYears,
      });

      if (profile.role !== resolved.role || profile.status !== resolved.status) {
        return {
          ...profile,
          role: resolved.role,
          status: resolved.status,
        };
      }
    }

    return profile;
  }

  findUserByLinkedGmail(gmail: string): Promise<UserDto | null> {
    return this.alumniRepository.findUserByLinkedGmail(gmail);
  }
}

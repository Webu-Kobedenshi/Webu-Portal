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
    limit: number;
    offset: number;
  }): Promise<AlumniConnectionDto> {
    return this.alumniRepository.findPublicList(params);
  }

  getAlumniDetail(id: string): Promise<AlumniProfileDto | null> {
    return this.alumniRepository.findPublicById(id);
  }

  async getMyProfile(userId: string): Promise<UserDto | null> {
    const snapshot = await this.alumniRepository.findUserRoleStatusSnapshot(userId);
    if (!snapshot) {
      return null;
    }

    if (snapshot.enrollmentYear && snapshot.durationYears) {
      const resolved = resolveRoleAndStatus({
        enrollmentYear: snapshot.enrollmentYear,
        durationYears: snapshot.durationYears,
      });

      if (snapshot.role !== resolved.role || snapshot.status !== resolved.status) {
        await this.alumniRepository.updateRoleAndStatus(userId, resolved.role, resolved.status);
      }
    }

    return this.alumniRepository.findUserById(userId);
  }
}

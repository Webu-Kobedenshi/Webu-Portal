import { Injectable } from "@nestjs/common";
import type { Department } from "../../domain/types/department";
import type { AlumniRepository } from "../../infrastructure/alumni.repository";
import type { AlumniConnectionDto, AlumniProfileDto, UserDto } from "../dto/alumni.dto";

@Injectable()
export class AlumniQueryService {
  constructor(private readonly alumniRepository: AlumniRepository) {}

  getAlumniList(params: {
    department?: Department;
    limit: number;
    offset: number;
  }): Promise<AlumniConnectionDto> {
    return this.alumniRepository.findPublicList(params);
  }

  getAlumniDetail(id: string): Promise<AlumniProfileDto | null> {
    return this.alumniRepository.findPublicById(id);
  }

  getMyProfile(userId: string): Promise<UserDto | null> {
    return this.alumniRepository.findUserById(userId);
  }
}

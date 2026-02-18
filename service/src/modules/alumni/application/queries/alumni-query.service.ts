import { Injectable } from "@nestjs/common";
import type { Alumni, Department } from "@prisma/client";
import type { AlumniRepository } from "../../infrastructure/alumni.repository";

@Injectable()
export class AlumniQueryService {
  constructor(private readonly alumniRepository: AlumniRepository) {}

  list(params: { search?: string; department?: Department }): Promise<Alumni[]> {
    return this.alumniRepository.findMany(params);
  }

  getById(id: string): Promise<Alumni | null> {
    return this.alumniRepository.findById(id);
  }
}

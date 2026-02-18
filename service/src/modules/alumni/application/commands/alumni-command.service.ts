import { Injectable } from "@nestjs/common";
import type { Alumni, Department } from "@prisma/client";
import type { AlumniRepository } from "../../infrastructure/alumni.repository";

type CreateAlumniInput = {
  name: string;
  graduationYear: number;
  department: Department;
  company: string;
  message?: string;
  contactEmail?: string;
  isContactable?: boolean;
  isPublic?: boolean;
};

type UpdateAlumniInput = Partial<CreateAlumniInput>;

@Injectable()
export class AlumniCommandService {
  constructor(private readonly alumniRepository: AlumniRepository) {}

  create(input: CreateAlumniInput): Promise<Alumni> {
    return this.alumniRepository.create(input);
  }

  async update(id: string, input: UpdateAlumniInput): Promise<Alumni> {
    return this.alumniRepository.update(id, input);
  }
}

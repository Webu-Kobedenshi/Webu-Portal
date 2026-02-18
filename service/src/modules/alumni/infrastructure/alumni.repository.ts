import { Injectable } from "@nestjs/common";
import type { Alumni, Department, Prisma } from "@prisma/client";
import type { PrismaService } from "../../../prisma.service";

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

const alumniSelect = {
  id: true,
  name: true,
  graduationYear: true,
  department: true,
  company: true,
  message: true,
  contactEmail: true,
  isContactable: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AlumniSelect;

@Injectable()
export class AlumniRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(params: { search?: string; department?: Department }): Promise<Alumni[]> {
    const { search, department } = params;

    return this.prisma.alumni.findMany({
      where: {
        isPublic: true,
        ...(department ? { department } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
                { message: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      select: alumniSelect,
      orderBy: [{ graduationYear: "desc" }, { createdAt: "desc" }],
    });
  }

  findById(id: string): Promise<Alumni | null> {
    return this.prisma.alumni.findFirst({
      where: {
        id,
        isPublic: true,
      },
      select: alumniSelect,
    });
  }

  create(input: CreateAlumniInput): Promise<Alumni> {
    return this.prisma.alumni.create({
      data: {
        name: input.name,
        graduationYear: input.graduationYear,
        department: input.department,
        company: input.company,
        message: input.message,
        contactEmail: input.contactEmail,
        isContactable: input.isContactable ?? false,
        isPublic: input.isPublic ?? true,
      },
      select: alumniSelect,
    });
  }

  update(id: string, input: UpdateAlumniInput): Promise<Alumni> {
    return this.prisma.alumni.update({
      where: { id },
      data: {
        name: input.name,
        graduationYear: input.graduationYear,
        department: input.department,
        company: input.company,
        message: input.message,
        contactEmail: input.contactEmail,
        isContactable: input.isContactable,
        isPublic: input.isPublic,
      },
      select: alumniSelect,
    });
  }
}

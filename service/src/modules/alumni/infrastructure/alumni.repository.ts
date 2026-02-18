import { Injectable } from "@nestjs/common";
import type {
  AlumniProfile,
  Prisma,
  Department as PrismaDepartment,
  Role as PrismaRole,
  UserStatus as PrismaUserStatus,
  User,
} from "@prisma/client";
import type { PrismaService } from "../../../prisma.service";
import type { Department } from "../domain/types/department";
import type { UserRole, UserStatus } from "../domain/types/user";

type InitialSettingsInput = {
  studentId: string;
  enrollmentYear: number;
  durationYears: number;
  department: Department;
  role: UserRole;
  status: UserStatus;
};

type UpdateAlumniProfileInput = {
  nickname?: string;
  graduationYear: number;
  department: Department;
  companyName: string;
  remarks?: string;
  contactEmail?: string;
  isPublic: boolean;
  acceptContact: boolean;
};

type AlumniConnection = {
  items: AlumniProfile[];
  totalCount: number;
  hasNextPage: boolean;
};

const alumniProfileSelect = {
  id: true,
  userId: true,
  nickname: true,
  graduationYear: true,
  department: true,
  companyName: true,
  remarks: true,
  contactEmail: true,
  isPublic: true,
  acceptContact: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      email: true,
      name: true,
      studentId: true,
      role: true,
      status: true,
      enrollmentYear: true,
      durationYears: true,
      department: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.AlumniProfileSelect;

const userSelect = {
  id: true,
  email: true,
  name: true,
  studentId: true,
  role: true,
  status: true,
  enrollmentYear: true,
  durationYears: true,
  department: true,
  createdAt: true,
  updatedAt: true,
  alumniProfile: {
    select: alumniProfileSelect,
  },
} satisfies Prisma.UserSelect;

@Injectable()
export class AlumniRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toPrismaDepartment(value: Department): PrismaDepartment {
    return value as PrismaDepartment;
  }

  private toPrismaRole(value: UserRole): PrismaRole {
    return value as PrismaRole;
  }

  private toPrismaUserStatus(value: UserStatus): PrismaUserStatus {
    return value as PrismaUserStatus;
  }

  async findPublicList(params: {
    department?: Department;
    limit: number;
    offset: number;
  }): Promise<AlumniConnection> {
    const { department, limit, offset } = params;
    const where: Prisma.AlumniProfileWhereInput = {
      isPublic: true,
      ...(department ? { department: this.toPrismaDepartment(department) } : {}),
    };

    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.alumniProfile.findMany({
        where,
        select: alumniProfileSelect,
        orderBy: [{ createdAt: "desc" }],
        skip: offset,
        take: limit,
      }),
      this.prisma.alumniProfile.count({ where }),
    ]);

    return {
      items,
      totalCount,
      hasNextPage: offset + items.length < totalCount,
    };
  }

  findPublicById(id: string): Promise<AlumniProfile | null> {
    return this.prisma.alumniProfile.findFirst({
      where: {
        id,
        isPublic: true,
      },
      select: alumniProfileSelect,
    });
  }

  findUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
  }

  updateInitialSettings(userId: string, input: InitialSettingsInput): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        studentId: input.studentId,
        enrollmentYear: input.enrollmentYear,
        durationYears: input.durationYears,
        department: this.toPrismaDepartment(input.department),
        role: this.toPrismaRole(input.role),
        status: this.toPrismaUserStatus(input.status),
      },
      select: userSelect,
    });
  }

  upsertAlumniProfile(userId: string, input: UpdateAlumniProfileInput): Promise<AlumniProfile> {
    return this.prisma.alumniProfile.upsert({
      where: { userId },
      create: {
        userId,
        nickname: input.nickname,
        graduationYear: input.graduationYear,
        department: this.toPrismaDepartment(input.department),
        companyName: input.companyName,
        remarks: input.remarks,
        contactEmail: input.contactEmail,
        isPublic: input.isPublic,
        acceptContact: input.acceptContact,
      },
      update: {
        nickname: input.nickname,
        graduationYear: input.graduationYear,
        department: this.toPrismaDepartment(input.department),
        companyName: input.companyName,
        remarks: input.remarks,
        contactEmail: input.contactEmail,
        isPublic: input.isPublic,
        acceptContact: input.acceptContact,
      },
      select: alumniProfileSelect,
    });
  }
}

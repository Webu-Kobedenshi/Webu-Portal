import { ConflictException, Inject, Injectable } from "@nestjs/common";
import type {
  Prisma,
  Department as PrismaDepartment,
  Role as PrismaRole,
  UserStatus as PrismaUserStatus,
} from "@prisma/client";
import { PrismaService } from "../../../prisma.service";
import type { AlumniProfileDto, UserDto } from "../application/dto/alumni.dto";
import type { Department } from "../domain/types/department";
import type { UserRole, UserStatus } from "../domain/types/user";

type InitialSettingsInput = {
  name: string;
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
  companyNames: string[];
  remarks?: string;
  contactEmail?: string;
  isPublic: boolean;
  acceptContact: boolean;
  skills?: string[];
  portfolioUrl?: string;
  gakuchika?: string;
  entryTrigger?: string;
  interviewTip?: string;
  usefulCoursework?: string;
};

type AlumniConnection = {
  items: AlumniProfileDto[];
  totalCount: number;
  hasNextPage: boolean;
};

const userBaseSelect = {
  id: true,
  email: true,
  name: true,
  studentId: true,
  linkedGmail: true,
  role: true,
  status: true,
  enrollmentYear: true,
  durationYears: true,
  department: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const alumniProfileSelect = {
  id: true,
  userId: true,
  nickname: true,
  graduationYear: true,
  department: true,
  companies: {
    select: {
      companyName: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },
  remarks: true,
  contactEmail: true,
  avatarUrl: true,
  skills: true,
  portfolioUrl: true,
  gakuchika: true,
  entryTrigger: true,
  interviewTip: true,
  usefulCoursework: true,
  isPublic: true,
  acceptContact: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: userBaseSelect,
  },
} as Prisma.AlumniProfileSelect;

const userSelect = {
  ...userBaseSelect,
  alumniProfile: {
    select: alumniProfileSelect,
  },
} satisfies Prisma.UserSelect;

type AlumniProfileRecord = Prisma.AlumniProfileGetPayload<{ select: typeof alumniProfileSelect }>;
type UserRecord = Prisma.UserGetPayload<{ select: typeof userSelect }>;

@Injectable()
export class AlumniRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private toPrismaDepartment(value: Department): PrismaDepartment {
    return value as PrismaDepartment;
  }

  private toPrismaRole(value: UserRole): PrismaRole {
    return value as PrismaRole;
  }

  private toPrismaUserStatus(value: UserStatus): PrismaUserStatus {
    return value as PrismaUserStatus;
  }

  private toUserDto(record: UserRecord): UserDto {
    return {
      ...record,
      alumniProfile: record.alumniProfile ? this.toAlumniProfileDto(record.alumniProfile) : null,
    };
  }

  private toAlumniProfileDto(record: AlumniProfileRecord): AlumniProfileDto {
    return {
      id: record.id,
      userId: record.userId,
      nickname: record.nickname,
      graduationYear: record.graduationYear,
      department: record.department as Department,
      companyNames: record.companies.map((item) => item.companyName),
      remarks: record.remarks,
      contactEmail: record.contactEmail,
      avatarUrl: (record as { avatarUrl?: string | null }).avatarUrl ?? null,
      skills: (record as { skills?: string[] }).skills ?? [],
      portfolioUrl: (record as { portfolioUrl?: string | null }).portfolioUrl ?? null,
      gakuchika: (record as { gakuchika?: string | null }).gakuchika ?? null,
      entryTrigger: (record as { entryTrigger?: string | null }).entryTrigger ?? null,
      interviewTip: (record as { interviewTip?: string | null }).interviewTip ?? null,
      usefulCoursework: (record as { usefulCoursework?: string | null }).usefulCoursework ?? null,
      isPublic: record.isPublic,
      acceptContact: record.acceptContact,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      user: {
        ...record.user,
        department: record.user.department as Department | null,
      },
    };
  }

  async findPublicList(params: {
    department?: Department;
    company?: string;
    graduationYear?: number;
    limit: number;
    offset: number;
  }): Promise<AlumniConnection> {
    const { department, company, graduationYear, limit, offset } = params;
    const where: Prisma.AlumniProfileWhereInput = {
      isPublic: true,
      ...(department ? { department: this.toPrismaDepartment(department) } : {}),
      ...(graduationYear ? { graduationYear } : {}),
      ...(company
        ? {
            companies: {
              some: {
                companyName: {
                  contains: company,
                  mode: "insensitive",
                },
              },
            },
          }
        : {}),
    };

    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.alumniProfile.findMany({
        where,
        select: alumniProfileSelect,
        orderBy: [{ graduationYear: "desc" }, { createdAt: "desc" }],
        skip: offset,
        take: limit,
      }),
      this.prisma.alumniProfile.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toAlumniProfileDto(item)),
      totalCount,
      hasNextPage: offset + items.length < totalCount,
    };
  }

  async findPublicById(id: string): Promise<AlumniProfileDto | null> {
    const record = await this.prisma.alumniProfile.findFirst({
      where: {
        id,
        isPublic: true,
      },
      select: alumniProfileSelect,
    });

    return record ? this.toAlumniProfileDto(record) : null;
  }

  async findUserById(userId: string): Promise<UserDto | null> {
    const record = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    return record ? this.toUserDto(record) : null;
  }

  async updateInitialSettings(userId: string, input: InitialSettingsInput): Promise<UserDto> {
    try {
      const record = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: input.name,
          studentId: input.studentId,
          enrollmentYear: input.enrollmentYear,
          durationYears: input.durationYears,
          department: this.toPrismaDepartment(input.department),
          role: this.toPrismaRole(input.role),
          status: this.toPrismaUserStatus(input.status),
        },
        select: userSelect,
      });

      return this.toUserDto(record);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
        throw new ConflictException("この学籍番号はすでに他のユーザーに登録されています");
      }
      throw error;
    }
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result = await this.prisma.user.deleteMany({
      where: { id: userId },
    });

    return result.count > 0;
  }

  async upsertAlumniProfile(
    userId: string,
    input: UpdateAlumniProfileInput,
  ): Promise<AlumniProfileDto> {
    const profileId = await this.prisma.$transaction(async (transaction) => {
      const profile = await transaction.alumniProfile.upsert({
        where: { userId },
        create: {
          userId,
          nickname: input.nickname,
          graduationYear: input.graduationYear,
          department: this.toPrismaDepartment(input.department),
          remarks: input.remarks,
          contactEmail: input.contactEmail,
          isPublic: input.isPublic,
          acceptContact: input.acceptContact,
          skills: input.skills ?? [],
          portfolioUrl: input.portfolioUrl,
          gakuchika: input.gakuchika,
          entryTrigger: input.entryTrigger,
          interviewTip: input.interviewTip,
          usefulCoursework: input.usefulCoursework,
        },
        update: {
          nickname: input.nickname,
          graduationYear: input.graduationYear,
          department: this.toPrismaDepartment(input.department),
          remarks: input.remarks,
          contactEmail: input.contactEmail,
          isPublic: input.isPublic,
          acceptContact: input.acceptContact,
          skills: input.skills ?? [],
          portfolioUrl: input.portfolioUrl,
          gakuchika: input.gakuchika,
          entryTrigger: input.entryTrigger,
          interviewTip: input.interviewTip,
          usefulCoursework: input.usefulCoursework,
        },
        select: {
          id: true,
        },
      });

      await transaction.alumniCompany.deleteMany({
        where: {
          alumniProfileId: profile.id,
          companyName: {
            notIn: input.companyNames,
          },
        },
      });

      if (input.companyNames.length > 0) {
        await transaction.alumniCompany.createMany({
          data: input.companyNames.map((companyName) => ({
            alumniProfileId: profile.id,
            companyName,
          })),
          skipDuplicates: true,
        });
      }

      return profile.id;
    });

    const record = await this.prisma.alumniProfile.findUnique({
      where: { id: profileId },
      select: alumniProfileSelect,
    });

    if (!record) {
      throw new Error("Failed to load updated alumni profile");
    }

    return this.toAlumniProfileDto(record);
  }

  async updateAvatarUrl(userId: string, avatarUrl: string): Promise<AlumniProfileDto | null> {
    const profile = await this.prisma.alumniProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      return null;
    }

    const record = await this.prisma.alumniProfile.update({
      where: { id: profile.id },
      data: { avatarUrl } as Prisma.AlumniProfileUncheckedUpdateInput,
      select: alumniProfileSelect,
    });

    return this.toAlumniProfileDto(record);
  }

  async findUserByLinkedGmail(gmail: string): Promise<UserDto | null> {
    const record = await this.prisma.user.findUnique({
      where: { linkedGmail: gmail.toLowerCase().trim() },
      select: userSelect,
    });

    return record ? this.toUserDto(record) : null;
  }

  async updateLinkedGmail(userId: string, gmail: string | null): Promise<UserDto> {
    const record = await this.prisma.user.update({
      where: { id: userId },
      data: { linkedGmail: gmail },
      select: userSelect,
    });

    return this.toUserDto(record);
  }
}

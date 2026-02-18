import type { Department } from "../../domain/types/department";
import type { UserRole, UserStatus } from "../../domain/types/user";

export type UserDto = {
  id: string;
  email: string;
  name: string | null;
  studentId: string | null;
  role: UserRole;
  status: UserStatus;
  enrollmentYear: number | null;
  durationYears: number | null;
  department: Department | null;
  createdAt: Date;
  updatedAt: Date;
  alumniProfile?: AlumniProfileDto | null;
};

export type AlumniProfileDto = {
  id: string;
  userId: string;
  nickname: string | null;
  graduationYear: number;
  department: Department;
  companyNames: string[];
  remarks: string | null;
  contactEmail: string | null;
  isPublic: boolean;
  acceptContact: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: UserDto;
};

export type AlumniConnectionDto = {
  items: AlumniProfileDto[];
  totalCount: number;
  hasNextPage: boolean;
};

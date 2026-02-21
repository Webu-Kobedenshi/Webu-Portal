import type { Department } from "../../domain/types/department";

export type InitialSettingsInput = {
  name: string;
  studentId: string;
  enrollmentYear: number;
  durationYears: number;
  department: Department;
};

export type UpdateAlumniProfileInput = {
  nickname?: string;
  graduationYear: number;
  department: Department;
  companyNames: string[];
  remarks?: string;
  contactEmail?: string;
  isPublic?: boolean;
  acceptContact?: boolean;
  skills?: string[];
  portfolioUrl?: string;
  gakuchika?: string;
  entryTrigger?: string;
  interviewTip?: string;
  usefulCoursework?: string;
};

export type UploadUrlResponse = {
  uploadUrl: string;
  fileUrl: string;
  key: string;
};

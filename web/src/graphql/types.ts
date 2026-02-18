export type Department = "GAME" | "IT" | "DESIGN" | "CG" | "SOUND" | "OTHER";

export type Alumni = {
  id: string;
  name: string;
  graduationYear: number;
  department: Department;
  company: string;
  message: string | null;
  contactEmail: string | null;
  isContactable: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

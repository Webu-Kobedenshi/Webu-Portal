export type Department =
  | "IT_EXPERT"
  | "IT_SPECIALIST"
  | "INFORMATION_PROCESS"
  | "PROGRAMMING"
  | "AI_SYSTEM"
  | "ADVANCED_STUDIES"
  | "INFO_BUSINESS"
  | "INFO_ENGINEERING"
  | "GAME_RESEARCH"
  | "GAME_ENGINEER"
  | "GAME_SOFTWARE"
  | "ESPORTS"
  | "CG_ANIMATION"
  | "DIGITAL_ANIME"
  | "GRAPHIC_DESIGN"
  | "INDUSTRIAL_DESIGN"
  | "ARCHITECTURAL"
  | "SOUND_CREATE"
  | "SOUND_TECHNIQUE"
  | "VOICE_ACTOR"
  | "INTERNATIONAL_COMM"
  | "OTHERS";

export type AlumniProfile = {
  id: string;
  userId: string;
  nickname: string | null;
  graduationYear: number;
  department: Department;
  companyName: string;
  remarks: string | null;
  contactEmail: string | null;
  isPublic: boolean;
  acceptContact: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AlumniConnection = {
  items: AlumniProfile[];
  totalCount: number;
  hasNextPage: boolean;
};

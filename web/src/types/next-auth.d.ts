import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "STUDENT" | "ALUMNI" | "ADMIN";
    };
    serviceToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: "STUDENT" | "ALUMNI" | "ADMIN";
    serviceToken?: string;
  }
}

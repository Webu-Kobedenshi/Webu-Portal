import { SignJWT } from "jose";
import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

const DEFAULT_AUTHORIZED_DOMAIN = "st.kobedenshi.ac.jp";

type Role = "STUDENT" | "ALUMNI" | "ADMIN";

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_JWT_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_JWT_SECRET or NEXTAUTH_SECRET is required");
  }

  return new TextEncoder().encode(secret);
}

function isAuthorizedEmail(email?: string | null): boolean {
  if (!email) {
    return false;
  }

  const normalizedEmail = email.toLowerCase();
  const allowedDomainsRaw = process.env.AUTH_ALLOWED_DOMAINS?.trim() || DEFAULT_AUTHORIZED_DOMAIN;
  const allowedDomains = allowedDomainsRaw
    .split(",")
    .map((item) => item.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);

  return allowedDomains.some((domain) => normalizedEmail.endsWith(`@${domain}`));
}

async function createServiceToken(payload: {
  userId: string;
  email: string;
  role: Role;
  name?: string;
}) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    name: payload.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getJwtSecret());
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return isAuthorizedEmail(user.email);
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }

      if (user?.name) {
        token.name = user.name;
      }

      const role = (token.role as Role | undefined) ?? "STUDENT";
      token.role = role;

      const userId = (token.userId as string | undefined) ?? token.sub;
      if (!userId || !token.email) {
        return token;
      }

      token.userId = userId;
      token.serviceToken = await createServiceToken({
        userId,
        email: token.email,
        role,
        name: typeof token.name === "string" ? token.name : undefined,
      });

      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      session.user.id = (token.userId as string | undefined) ?? token.sub ?? "";
      session.user.role = ((token.role as Role | undefined) ?? "STUDENT") as Role;
      session.serviceToken = token.serviceToken as string | undefined;

      return session;
    },
  },
};

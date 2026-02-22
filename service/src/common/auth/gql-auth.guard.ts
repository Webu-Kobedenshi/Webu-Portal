import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Role, type User, UserStatus } from "@prisma/client";
import { jwtVerify } from "jose";
import { PrismaService } from "../../prisma.service";

type AuthPayload = {
  sub?: string;
  email?: string;
  name?: string;
  role?: "STUDENT" | "ALUMNI" | "ADMIN";
};

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private getSecret(): Uint8Array {
    const secret = process.env.AUTH_JWT_SECRET ?? process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new UnauthorizedException("Authentication is not configured");
    }

    return new TextEncoder().encode(secret);
  }

  private async findOrCreateUser(payload: Required<Pick<AuthPayload, "email">> & AuthPayload) {
    if (payload.email.toLowerCase().endsWith("@gmail.com")) {
      const linkedUser = await this.prisma.user.findUnique({
        where: { linkedGmail: payload.email.toLowerCase().trim() },
      });

      if (linkedUser) {
        return linkedUser;
      }
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        role: (payload.role as Role | undefined) ?? Role.STUDENT,
        status: UserStatus.ENROLLED,
      },
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext<{
      req?: {
        headers?: Record<string, string | string[] | undefined>;
        user?: User;
      };
    }>();
    const headerValue = ctx.req?.headers?.authorization;
    const authorization = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Authentication required");
    }

    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      throw new UnauthorizedException("Authentication required");
    }

    let payload: AuthPayload;
    try {
      const verified = await jwtVerify(token, this.getSecret(), {
        algorithms: ["HS256"],
      });
      payload = verified.payload as AuthPayload;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }

    const email = payload.email;
    if (!email) {
      throw new UnauthorizedException("Invalid token payload");
    }

    const user = await this.findOrCreateUser({
      ...payload,
      email,
    });

    if (ctx.req) {
      ctx.req.user = user;
    }

    return true;
  }
}

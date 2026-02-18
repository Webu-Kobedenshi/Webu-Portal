import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GqlAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext<{
      req?: { headers?: Record<string, string | string[] | undefined>; user?: { id?: string } };
    }>();
    const headerValue = ctx.req?.headers?.["x-user-id"];
    const userIdFromHeader = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    const userId = ctx.req?.user?.id ?? userIdFromHeader;

    if (!userId) {
      throw new UnauthorizedException("Authentication required");
    }

    if (ctx.req) {
      ctx.req.user = { id: userId };
    }

    return true;
  }
}

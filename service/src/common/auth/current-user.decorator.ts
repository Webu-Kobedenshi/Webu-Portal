import { type ExecutionContext, UnauthorizedException, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { User } from "@prisma/client";

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context).getContext<{
    req?: { user?: User };
  }>();
  const user = ctx.req?.user;

  if (!user) {
    throw new UnauthorizedException("Authentication required");
  }

  return user;
});

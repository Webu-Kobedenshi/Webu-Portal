import { type ExecutionContext, UnauthorizedException, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const CurrentUserId = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context).getContext<{
    req?: { user?: { id?: string } };
  }>();
  const userId = ctx.req?.user?.id;

  if (!userId) {
    throw new UnauthorizedException("Authentication required");
  }

  return userId;
});

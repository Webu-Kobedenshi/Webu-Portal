import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class AppResolver {
  @Query("hello")
  hello(): string {
    return "Hello from NestJS GraphQL";
  }

  @Query("health")
  health(): string {
    return "ok";
  }
}

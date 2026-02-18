import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class AppResolver {
  @Query("health")
  health(): string {
    return "ok";
  }
}

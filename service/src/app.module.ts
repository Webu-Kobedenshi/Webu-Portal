import { join } from "node:path";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AppResolver } from "./app.resolver";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: [join(process.cwd(), "src/**/*.graphql")],
      playground: true,
    }),
  ],
  providers: [AppResolver, PrismaService],
})
export class AppModule {}

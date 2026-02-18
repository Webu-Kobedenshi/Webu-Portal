import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { AlumniCommandService } from "./application/commands/alumni-command.service";
import { AlumniQueryService } from "./application/queries/alumni-query.service";
import { AlumniRepository } from "./infrastructure/alumni.repository";
import { AlumniResolver } from "./presentation/alumni.resolver";

@Module({
  providers: [
    PrismaService,
    AlumniRepository,
    AlumniQueryService,
    AlumniCommandService,
    AlumniResolver,
  ],
})
export class AlumniModule {}

import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import type { Alumni, Department } from "@prisma/client";
import type { AlumniCommandService } from "../application/commands/alumni-command.service";
import type { AlumniQueryService } from "../application/queries/alumni-query.service";

type CreateAlumniInput = {
  name: string;
  graduationYear: number;
  department: Department;
  company: string;
  message?: string;
  contactEmail?: string;
  isContactable?: boolean;
  isPublic?: boolean;
};

type UpdateAlumniInput = Partial<CreateAlumniInput>;

@Resolver("Alumni")
export class AlumniResolver {
  constructor(
    private readonly alumniQueryService: AlumniQueryService,
    private readonly alumniCommandService: AlumniCommandService,
  ) {}

  @Query("alumniList")
  alumniList(
    @Args("search", { nullable: true }) search?: string,
    @Args("department", { nullable: true }) department?: Department,
  ): Promise<Alumni[]> {
    return this.alumniQueryService.list({ search, department });
  }

  @Query("alumniById")
  alumniById(@Args("id") id: string): Promise<Alumni | null> {
    return this.alumniQueryService.getById(id);
  }

  @Mutation("createAlumni")
  createAlumni(@Args("input") input: CreateAlumniInput): Promise<Alumni> {
    return this.alumniCommandService.create(input);
  }

  @Mutation("updateAlumni")
  updateAlumni(@Args("id") id: string, @Args("input") input: UpdateAlumniInput): Promise<Alumni> {
    return this.alumniCommandService.update(id, input);
  }
}

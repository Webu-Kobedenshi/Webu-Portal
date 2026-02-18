import { NotFoundException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import type { User } from "@prisma/client";
import { CurrentUser } from "../../../common/auth/current-user.decorator";
import { GqlAuthGuard } from "../../../common/auth/gql-auth.guard";
import type { AlumniCommandService } from "../application/commands/alumni-command.service";
import type { AlumniConnectionDto, AlumniProfileDto, UserDto } from "../application/dto/alumni.dto";
import type { AlumniQueryService } from "../application/queries/alumni-query.service";
import type { Department } from "../domain/types/department";

type InitialSettingsInput = {
  studentId: string;
  enrollmentYear: number;
  durationYears: number;
  department: Department;
};

type UpdateAlumniProfileInput = {
  nickname?: string;
  graduationYear: number;
  department: Department;
  companyName: string;
  remarks?: string;
  contactEmail?: string;
  isPublic?: boolean;
  acceptContact?: boolean;
};

@Resolver()
@UseGuards(GqlAuthGuard)
export class AlumniResolver {
  constructor(
    private readonly alumniQueryService: AlumniQueryService,
    private readonly alumniCommandService: AlumniCommandService,
  ) {}

  @Query("getAlumniList")
  getAlumniList(
    @Args("department", { nullable: true }) department?: Department,
    @Args("limit") limit?: number,
    @Args("offset") offset?: number,
  ): Promise<AlumniConnectionDto> {
    return this.alumniQueryService.getAlumniList({
      department,
      limit: limit ?? 20,
      offset: offset ?? 0,
    });
  }

  @Query("getAlumniDetail")
  getAlumniDetail(@Args("id") id: string): Promise<AlumniProfileDto | null> {
    return this.alumniQueryService.getAlumniDetail(id);
  }

  @Query("getMyProfile")
  async getMyProfile(@CurrentUser() user: User): Promise<UserDto> {
    const userId = user.id;
    const profile = await this.alumniQueryService.getMyProfile(userId);
    if (!profile) {
      throw new NotFoundException("User not found");
    }

    return profile;
  }

  @Mutation("updateInitialSettings")
  updateInitialSettings(
    @CurrentUser() user: User,
    @Args("input") input: InitialSettingsInput,
  ): Promise<UserDto> {
    return this.alumniCommandService.updateInitialSettings(user.id, input);
  }

  @Mutation("updateAlumniProfile")
  updateAlumniProfile(
    @CurrentUser() user: User,
    @Args("input") input: UpdateAlumniProfileInput,
  ): Promise<AlumniProfileDto> {
    return this.alumniCommandService.updateAlumniProfile(user.id, input);
  }
}

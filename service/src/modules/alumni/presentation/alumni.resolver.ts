import { NotFoundException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUserId } from "../../../common/auth/current-user-id.decorator";
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

  @UseGuards(GqlAuthGuard)
  @Query("getMyProfile")
  async getMyProfile(@CurrentUserId() userId: string): Promise<UserDto> {
    const user = await this.alumniQueryService.getMyProfile(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation("updateInitialSettings")
  updateInitialSettings(
    @CurrentUserId() userId: string,
    @Args("input") input: InitialSettingsInput,
  ): Promise<UserDto> {
    return this.alumniCommandService.updateInitialSettings(userId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation("updateAlumniProfile")
  updateAlumniProfile(
    @CurrentUserId() userId: string,
    @Args("input") input: UpdateAlumniProfileInput,
  ): Promise<AlumniProfileDto> {
    return this.alumniCommandService.updateAlumniProfile(userId, input);
  }
}

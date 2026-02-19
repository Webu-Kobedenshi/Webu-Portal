import { Inject, NotFoundException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import type { User } from "@prisma/client";
import { CurrentUser } from "../../../common/auth/current-user.decorator";
import { GqlAuthGuard } from "../../../common/auth/gql-auth.guard";
import { AlumniCommandService } from "../application/commands/alumni-command.service";
import type { AlumniConnectionDto, AlumniProfileDto, UserDto } from "../application/dto/alumni.dto";
import type {
  InitialSettingsInput,
  UpdateAlumniProfileInput,
  UploadUrlResponse,
} from "../application/dto/alumni.input";
import { AlumniQueryService } from "../application/queries/alumni-query.service";
import type { Department } from "../domain/types/department";

@Resolver()
@UseGuards(GqlAuthGuard)
export class AlumniResolver {
  constructor(
    @Inject(AlumniQueryService)
    private readonly alumniQueryService: AlumniQueryService,
    @Inject(AlumniCommandService)
    private readonly alumniCommandService: AlumniCommandService,
  ) {}

  @Query("getAlumniList")
  getAlumniList(
    @Args("department", { nullable: true }) department?: Department,
    @Args("company", { nullable: true }) company?: string,
    @Args("graduationYear", { nullable: true }) graduationYear?: number,
    @Args("limit") limit?: number,
    @Args("offset") offset?: number,
  ): Promise<AlumniConnectionDto> {
    return this.alumniQueryService.getAlumniList({
      department,
      company,
      graduationYear,
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

  @Mutation("deleteMyAccount")
  deleteMyAccount(@CurrentUser() user: User): Promise<boolean> {
    return this.alumniCommandService.deleteMyAccount(user.id);
  }

  @Mutation("getUploadUrl")
  getUploadUrl(
    @CurrentUser() user: User,
    @Args("fileName") fileName: string,
    @Args("contentType") contentType: string,
  ): Promise<UploadUrlResponse> {
    return this.alumniCommandService.getUploadUrl(user.id, fileName, contentType);
  }

  @Mutation("updateAvatar")
  updateAvatar(@CurrentUser() user: User, @Args("url") url: string): Promise<AlumniProfileDto> {
    return this.alumniCommandService.updateAvatar(user.id, url);
  }
}

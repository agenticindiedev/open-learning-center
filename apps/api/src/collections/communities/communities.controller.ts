import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CommunitiesService } from "./communities.service";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";
import { ClerkAuthGuard } from "../../auth/guards/clerk-auth.guard";
import { OptionalClerkAuthGuard } from "../../auth/guards/optional-clerk-auth.guard";
import { AdminGuard } from "../../auth/guards/admin.guard";
import { CurrentUser, CurrentUserPayload } from "../../auth/decorators/current-user.decorator";

@ApiTags("communities")
@Controller("communities")
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get()
  @UseGuards(OptionalClerkAuthGuard)
  @ApiOperation({ summary: "Get published communities" })
  findPublished() {
    return this.communitiesService.findPublished();
  }

  @Get("slug/:slug")
  @UseGuards(OptionalClerkAuthGuard)
  @ApiOperation({ summary: "Get a published community by slug" })
  findBySlug(@Param("slug") slug: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.communitiesService.findBySlug(slug, false);
  }

  @Get("admin")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: list all communities" })
  findAllAdmin() {
    return this.communitiesService.findAllAdmin();
  }

  @Get("admin/:id")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: get community by ID" })
  findOneAdmin(@Param("id") id: string) {
    return this.communitiesService.findOneAdmin(id);
  }

  @Post()
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: create a community" })
  create(
    @Body() createCommunityDto: CreateCommunityDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.communitiesService.create(createCommunityDto, user.userId);
  }

  @Patch(":id")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: update a community" })
  update(
    @Param("id") id: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ) {
    return this.communitiesService.update(id, updateCommunityDto);
  }

  @Delete(":id")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: delete a community" })
  remove(@Param("id") id: string) {
    return this.communitiesService.remove(id);
  }
}

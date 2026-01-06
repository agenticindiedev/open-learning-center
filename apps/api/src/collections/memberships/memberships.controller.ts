import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MembershipsService } from "./memberships.service";
import { CreateMembershipDto } from "./dto/create-membership.dto";
import { ClerkAuthGuard } from "../../auth/guards/clerk-auth.guard";
import { CurrentUser, CurrentUserPayload } from "../../auth/decorators/current-user.decorator";

@ApiTags("memberships")
@Controller("memberships")
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Join a free community" })
  create(
    @Body() createMembershipDto: CreateMembershipDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.membershipsService.create(createMembershipDto, user.userId);
  }

  @Get("me")
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get memberships for current user" })
  findMine(@CurrentUser() user: CurrentUserPayload) {
    return this.membershipsService.findMine(user.userId);
  }
}

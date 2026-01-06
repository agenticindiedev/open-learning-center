import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProgressesService } from "./progresses.service";
import { CreateProgressDto } from "./dto/create-progress.dto";
import { ClerkAuthGuard } from "../../auth/guards/clerk-auth.guard";
import { CurrentUser, CurrentUserPayload } from "../../auth/decorators/current-user.decorator";

@ApiTags("progress")
@Controller("progress")
export class ProgressesController {
  constructor(private readonly progressesService: ProgressesService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark lesson progress" })
  upsert(
    @Body() createProgressDto: CreateProgressDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.progressesService.upsert(createProgressDto, user.userId);
  }

  @Get("me")
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get progress for current user" })
  findMine(@CurrentUser() user: CurrentUserPayload) {
    return this.progressesService.findMine(user.userId);
  }
}

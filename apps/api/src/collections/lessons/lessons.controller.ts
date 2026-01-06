import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LessonsService } from "./lessons.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { ClerkAuthGuard } from "../../auth/guards/clerk-auth.guard";
import { OptionalClerkAuthGuard } from "../../auth/guards/optional-clerk-auth.guard";
import { AdminGuard } from "../../auth/guards/admin.guard";
import { CurrentUser, CurrentUserPayload } from "../../auth/decorators/current-user.decorator";

@ApiTags("lessons")
@Controller("lessons")
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @UseGuards(OptionalClerkAuthGuard)
  @ApiOperation({ summary: "Get published lessons for a course" })
  findPublished(
    @Query("courseId") courseId: string,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.lessonsService.findPublished(courseId, user?.userId);
  }

  @Get("slug/:slug")
  @UseGuards(OptionalClerkAuthGuard)
  @ApiOperation({ summary: "Get a published lesson by slug" })
  findBySlug(@Param("slug") slug: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.lessonsService.findBySlug(slug, user?.userId);
  }

  @Get("admin")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: list all lessons" })
  findAllAdmin(@Query("courseId") courseId?: string) {
    return this.lessonsService.findAllAdmin(courseId);
  }

  @Get("admin/:id")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: get lesson by ID" })
  findOneAdmin(@Param("id") id: string) {
    return this.lessonsService.findOneAdmin(id);
  }

  @Post()
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: create a lesson" })
  create(
    @Body() createLessonDto: CreateLessonDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.lessonsService.create(createLessonDto, user.userId);
  }

  @Patch(":id")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: update a lesson" })
  update(
    @Param("id") id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(":id")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: delete a lesson" })
  remove(@Param("id") id: string) {
    return this.lessonsService.remove(id);
  }
}

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
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { ClerkAuthGuard } from "../../auth/guards/clerk-auth.guard";
import { OptionalClerkAuthGuard } from "../../auth/guards/optional-clerk-auth.guard";
import { AdminGuard } from "../../auth/guards/admin.guard";
import { CurrentUser, CurrentUserPayload } from "../../auth/decorators/current-user.decorator";

@ApiTags("courses")
@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @UseGuards(OptionalClerkAuthGuard)
  @ApiOperation({ summary: "Get published courses" })
  findPublished(@Query("communityId") communityId?: string) {
    return this.coursesService.findPublished(communityId);
  }

  @Get("slug/:slug")
  @UseGuards(OptionalClerkAuthGuard)
  @ApiOperation({ summary: "Get a published course by slug" })
  findBySlug(@Param("slug") slug: string) {
    return this.coursesService.findBySlug(slug, false);
  }

  @Get("admin")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: list all courses" })
  findAllAdmin(@Query("communityId") communityId?: string) {
    return this.coursesService.findAllAdmin(communityId);
  }

  @Get("admin/:id")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: get course by ID" })
  findOneAdmin(@Param("id") id: string) {
    return this.coursesService.findOneAdmin(id);
  }

  @Post()
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: create a course" })
  create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.coursesService.create(createCourseDto, user.userId);
  }

  @Patch(":id")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: update a course" })
  update(
    @Param("id") id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(":id")
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: delete a course" })
  remove(@Param("id") id: string) {
    return this.coursesService.remove(id);
  }
}

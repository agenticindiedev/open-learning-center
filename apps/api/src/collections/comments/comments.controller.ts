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
import { ClerkAuthGuard } from "../../auth/guards/clerk-auth.guard";
import { CurrentUser, CurrentUserPayload } from "../../auth/decorators/current-user.decorator";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@ApiTags("comments")
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: "Get comments for a lesson" })
  findByLesson(@Query("lessonId") lessonId: string) {
    return this.commentsService.findByLessonId(lessonId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a comment by ID" })
  findOne(@Param("id") id: string) {
    return this.commentsService.findOne(id);
  }

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a comment (requires authentication)" })
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.commentsService.create(createCommentDto, user.userId);
  }

  @Patch(":id")
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update your own comment" })
  update(
    @Param("id") id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.commentsService.update(id, updateCommentDto, user.userId);
  }

  @Delete(":id")
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete your own comment" })
  remove(@Param("id") id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.commentsService.remove(id, user.userId);
  }
}

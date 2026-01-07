import { createClerkClient } from "@clerk/backend";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import { ConfigService } from "../../config/config.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment, type CommentDocument } from "./schemas/comment.schema";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
    private readonly configService: ConfigService,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const { userName, userAvatar } = await this.getUserInfo(userId);

    const comment = new this.commentModel({
      ...createCommentDto,
      userId,
      userName,
      userAvatar,
    });

    return comment.save();
  }

  async findByLessonId(lessonId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ lessonId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).lean().exec();
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("You can only edit your own comments");
    }

    Object.assign(comment, updateCommentDto);
    return comment.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("You can only delete your own comments");
    }

    await this.commentModel.findByIdAndDelete(id).exec();
  }

  private async getUserInfo(userId: string): Promise<{ userName: string; userAvatar?: string }> {
    try {
      const clerkSecretKey = this.configService.get("CLERK_SECRET_KEY");
      const clerk = createClerkClient({ secretKey: clerkSecretKey });
      const user = await clerk.users.getUser(userId);

      const userName =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.username || "Anonymous";

      return {
        userName,
        userAvatar: user.imageUrl,
      };
    } catch {
      return { userName: "Anonymous" };
    }
  }
}

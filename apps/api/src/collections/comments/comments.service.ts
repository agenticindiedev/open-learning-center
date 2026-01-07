import { createClerkClient } from '@clerk/backend';
import type { CreateCommentDto } from '@collections/comments/dto/create-comment.dto';
import type { UpdateCommentDto } from '@collections/comments/dto/update-comment.dto';
import { Comment, type CommentDocument } from '@collections/comments/schemas/comment.schema';
import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { ConfigService } from '../../config/config.service';
import {
  AchievementsService,
  type NewAchievementResult,
} from '../achievements/achievements.service';

export interface CommentCreateResult {
  comment: Comment;
  newAchievements: NewAchievementResult[];
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AchievementsService))
    private achievementsService: AchievementsService,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string): Promise<CommentCreateResult> {
    const { userName, userAvatar } = await this.getUserInfo(userId);

    const comment = new this.commentModel({
      ...createCommentDto,
      userId,
      userName,
      userAvatar,
    });

    const savedComment = await comment.save();
    const newAchievements = await this.checkAchievements(userId);

    return { comment: savedComment, newAchievements };
  }

  async countUserComments(userId: string): Promise<number> {
    return this.commentModel.countDocuments({ userId });
  }

  private async checkAchievements(userId: string): Promise<NewAchievementResult[]> {
    const commentCount = await this.countUserComments(userId);
    return this.achievementsService.checkAndAwardAchievements(userId, {
      commentCount,
    });
  }

  async findByLessonId(lessonId: string): Promise<Comment[]> {
    return this.commentModel.find({ lessonId }).sort({ createdAt: -1 }).lean().exec();
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
      throw new ForbiddenException('You can only edit your own comments');
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
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentModel.findByIdAndDelete(id).exec();
  }

  private async getUserInfo(userId: string): Promise<{ userName: string; userAvatar?: string }> {
    try {
      const clerkSecretKey = this.configService.get('CLERK_SECRET_KEY');
      const clerk = createClerkClient({ secretKey: clerkSecretKey });
      const user = await clerk.users.getUser(userId);

      const userName =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.username || 'Anonymous';

      return {
        userName,
        userAvatar: user.imageUrl,
      };
    } catch {
      return { userName: 'Anonymous' };
    }
  }
}

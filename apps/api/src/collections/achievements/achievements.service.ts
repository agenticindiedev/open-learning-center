import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateAchievementDto } from './dto/create-achievement.dto';
import type { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievement, type AchievementDocument } from './schemas/achievement.schema';
import {
  type AchievementMetadata,
  UserAchievement,
  type UserAchievementDocument,
} from './schemas/user-achievement.schema';

export interface AchievementWithStatus extends Achievement {
  earned: boolean;
  earnedAt?: Date;
}

export interface NewAchievementResult {
  achievement: Achievement;
  userAchievement: UserAchievement;
}

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement.name) private achievementModel: Model<AchievementDocument>,
    @InjectModel(UserAchievement.name) private userAchievementModel: Model<UserAchievementDocument>,
  ) {}

  async create(createAchievementDto: CreateAchievementDto): Promise<Achievement> {
    const achievement = new this.achievementModel(createAchievementDto);
    return achievement.save();
  }

  async findAll(): Promise<Achievement[]> {
    return this.achievementModel.find().sort({ category: 1, rarity: 1, sortOrder: 1 });
  }

  async findBySlug(slug: string): Promise<Achievement> {
    const achievement = await this.achievementModel.findOne({ slug });
    if (!achievement) {
      throw new NotFoundException(`Achievement with slug ${slug} not found`);
    }
    return achievement;
  }

  async findOne(id: string): Promise<Achievement> {
    const achievement = await this.achievementModel.findById(id);
    if (!achievement) {
      throw new NotFoundException(`Achievement with ID ${id} not found`);
    }
    return achievement;
  }

  async update(id: string, updateAchievementDto: UpdateAchievementDto): Promise<Achievement> {
    const achievement = await this.achievementModel.findByIdAndUpdate(id, updateAchievementDto, {
      new: true,
    });
    if (!achievement) {
      throw new NotFoundException(`Achievement with ID ${id} not found`);
    }
    return achievement;
  }

  async remove(id: string): Promise<void> {
    const result = await this.achievementModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Achievement with ID ${id} not found`);
    }
  }

  async findUserAchievements(userId: string): Promise<UserAchievement[]> {
    return this.userAchievementModel.find({ userId }).sort({ earnedAt: -1 });
  }

  async findRecentUserAchievements(userId: string, limit = 5): Promise<UserAchievement[]> {
    return this.userAchievementModel.find({ userId }).sort({ earnedAt: -1 }).limit(limit);
  }

  async findAllWithUserStatus(userId: string): Promise<AchievementWithStatus[]> {
    const [achievements, userAchievements] = await Promise.all([
      this.findAll(),
      this.findUserAchievements(userId),
    ]);

    const earnedMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua.earnedAt]));

    return achievements.map((achievement) => {
      const doc = achievement as AchievementDocument;
      const achievementId = doc._id.toString();
      const earnedAt = earnedMap.get(achievementId);
      return {
        ...doc.toObject(),
        earned: earnedMap.has(achievementId),
        earnedAt,
      };
    });
  }

  async awardAchievement(
    userId: string,
    achievementId: string,
    metadata?: AchievementMetadata,
  ): Promise<UserAchievement | null> {
    const existing = await this.userAchievementModel.findOne({ userId, achievementId });
    if (existing) {
      return null;
    }

    const userAchievement = new this.userAchievementModel({
      userId,
      achievementId,
      earnedAt: new Date(),
      metadata,
    });
    return userAchievement.save();
  }

  async checkAndAwardAchievements(
    userId: string,
    context: {
      lessonCount?: number;
      projectLessonCount?: number;
      commentCount?: number;
      currentStreak?: number;
      communityCount?: number;
      completedCourseId?: string;
      completedCommunityId?: string;
    },
  ): Promise<NewAchievementResult[]> {
    const achievements = await this.findAll();
    const userAchievements = await this.findUserAchievements(userId);
    const earnedIds = new Set(userAchievements.map((ua) => ua.achievementId));
    const newlyEarned: NewAchievementResult[] = [];

    for (const achievement of achievements) {
      const doc = achievement as AchievementDocument;
      const achievementId = doc._id.toString();
      if (earnedIds.has(achievementId)) {
        continue;
      }

      const earned = this.checkCriteria(achievement, context);
      if (earned) {
        const userAchievement = await this.awardAchievement(userId, achievementId, {
          count: context.lessonCount || context.projectLessonCount || context.commentCount,
          streak: context.currentStreak,
          courseId: context.completedCourseId,
          communityId: context.completedCommunityId,
        });
        if (userAchievement) {
          newlyEarned.push({ achievement, userAchievement });
        }
      }
    }

    return newlyEarned;
  }

  private checkCriteria(
    achievement: Achievement,
    context: {
      lessonCount?: number;
      projectLessonCount?: number;
      commentCount?: number;
      currentStreak?: number;
      communityCount?: number;
      completedCourseId?: string;
      completedCommunityId?: string;
    },
  ): boolean {
    const { criteria } = achievement;

    switch (criteria.type) {
      case 'lesson_count':
        return (context.lessonCount ?? 0) >= criteria.value;

      case 'project_lesson_count':
        return (context.projectLessonCount ?? 0) >= criteria.value;

      case 'comment_count':
        return (context.commentCount ?? 0) >= criteria.value;

      case 'streak_days':
        return (context.currentStreak ?? 0) >= criteria.value;

      case 'community_count':
        return (context.communityCount ?? 0) >= criteria.value;

      case 'course_complete':
        return !!context.completedCourseId;

      case 'community_complete':
        return !!context.completedCommunityId;

      default:
        return false;
    }
  }
}

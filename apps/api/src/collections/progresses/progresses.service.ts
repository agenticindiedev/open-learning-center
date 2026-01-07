import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  AchievementsService,
  type NewAchievementResult,
} from '../achievements/achievements.service';
import { LessonsService } from '../lessons/lessons.service';
import type { CreateProgressDto } from './dto/create-progress.dto';
import { Progress, type ProgressDocument } from './schemas/progress.schema';

export interface ProgressUpsertResult {
  progress: Progress;
  newAchievements: NewAchievementResult[];
}

@Injectable()
export class ProgressesService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    @Inject(forwardRef(() => AchievementsService))
    private achievementsService: AchievementsService,
    @Inject(forwardRef(() => LessonsService))
    private lessonsService: LessonsService,
  ) {}

  async upsert(
    createProgressDto: CreateProgressDto,
    userId: string,
  ): Promise<ProgressUpsertResult> {
    const completedAt = createProgressDto.completedAt || new Date();

    const progress = await this.progressModel.findOneAndUpdate(
      { userId, lessonId: createProgressDto.lessonId },
      { userId, lessonId: createProgressDto.lessonId, completedAt },
      { new: true, upsert: true },
    );

    const newAchievements = await this.checkAchievements(userId, createProgressDto.lessonId);

    return { progress, newAchievements };
  }

  async findMine(userId: string): Promise<Progress[]> {
    return this.progressModel.find({ userId }).sort({ updatedAt: -1 });
  }

  async countUserProgress(userId: string): Promise<number> {
    return this.progressModel.countDocuments({ userId });
  }

  async countUserProjectLessons(userId: string): Promise<number> {
    const progresses = await this.progressModel.find({ userId });
    let projectCount = 0;

    for (const progress of progresses) {
      try {
        const lesson = await this.lessonsService.findOneAdmin(progress.lessonId);
        if (lesson.slug.includes('project')) {
          projectCount++;
        }
      } catch {
        // Lesson not found, skip
      }
    }

    return projectCount;
  }

  async getCurrentStreak(userId: string): Promise<number> {
    const progresses = await this.progressModel
      .find({ userId, completedAt: { $exists: true } })
      .sort({ completedAt: -1 });

    if (progresses.length === 0) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = today;

    const completedDates = new Set<string>();
    for (const progress of progresses) {
      if (progress.completedAt) {
        const date = new Date(progress.completedAt);
        date.setHours(0, 0, 0, 0);
        completedDates.add(date.toISOString());
      }
    }

    while (true) {
      const dateStr = currentDate.toISOString();
      if (completedDates.has(dateStr)) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else if (streak === 0) {
        // Check yesterday if nothing today
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        const yesterdayStr = currentDate.toISOString();
        if (completedDates.has(yesterdayStr)) {
          streak++;
          currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return streak;
  }

  private async checkAchievements(
    userId: string,
    lessonId: string,
  ): Promise<NewAchievementResult[]> {
    const [lessonCount, projectLessonCount, currentStreak] = await Promise.all([
      this.countUserProgress(userId),
      this.countUserProjectLessons(userId),
      this.getCurrentStreak(userId),
    ]);

    return this.achievementsService.checkAndAwardAchievements(userId, {
      lessonCount,
      projectLessonCount,
      currentStreak,
    });
  }
}

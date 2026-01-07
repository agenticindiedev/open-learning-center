import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type UserAchievementDocument = UserAchievement & Document;

export interface AchievementMetadata {
  lessonId?: string;
  courseId?: string;
  communityId?: string;
  streak?: number;
  count?: number;
}

@Schema({ timestamps: true })
export class UserAchievement {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  achievementId: string;

  @Prop({ type: Date, required: true })
  earnedAt: Date;

  @Prop({ type: Object })
  metadata?: AchievementMetadata;
}

export const UserAchievementSchema = SchemaFactory.createForClass(UserAchievement);

UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
UserAchievementSchema.index({ userId: 1, earnedAt: -1 });

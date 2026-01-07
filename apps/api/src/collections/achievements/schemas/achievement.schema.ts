import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type AchievementDocument = Achievement & Document;

export type AchievementCategory = 'completion' | 'shipping' | 'engagement';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AchievementCriteria {
  type: string;
  value: number;
  lessonSlugPattern?: string;
}

@Schema({ timestamps: true })
export class Achievement {
  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  icon: string;

  @Prop({ type: String, required: true, enum: ['completion', 'shipping', 'engagement'] })
  category: AchievementCategory;

  @Prop({ type: String, required: true, enum: ['common', 'rare', 'epic', 'legendary'] })
  rarity: AchievementRarity;

  @Prop({ type: Object, required: true })
  criteria: AchievementCriteria;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);

AchievementSchema.index({ category: 1, rarity: 1, sortOrder: 1 });

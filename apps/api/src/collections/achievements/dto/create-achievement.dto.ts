import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import type { AchievementCategory, AchievementCriteria, AchievementRarity } from '../schemas/achievement.schema';

export class CreateAchievementDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  icon: string;

  @IsEnum(['completion', 'shipping', 'engagement'])
  category: AchievementCategory;

  @IsEnum(['common', 'rare', 'epic', 'legendary'])
  rarity: AchievementRarity;

  @IsObject()
  criteria: AchievementCriteria;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}

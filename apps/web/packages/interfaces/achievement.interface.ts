export type AchievementCategory = 'completion' | 'shipping' | 'engagement';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AchievementCriteria {
  type: string;
  value: number;
  lessonSlugPattern?: string;
}

export interface Achievement {
  _id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  criteria: AchievementCriteria;
  sortOrder: number;
}

export interface AchievementWithStatus extends Achievement {
  earned: boolean;
  earnedAt?: string;
}

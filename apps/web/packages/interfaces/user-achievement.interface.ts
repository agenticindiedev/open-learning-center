export interface AchievementMetadata {
  lessonId?: string;
  courseId?: string;
  communityId?: string;
  streak?: number;
  count?: number;
}

export interface UserAchievement {
  _id: string;
  userId: string;
  achievementId: string;
  earnedAt: string;
  metadata?: AchievementMetadata;
}

export interface ICommunitySeed {
  title: string;
  slug: string;
  description: string;
  isFree: boolean;
  priceMonthly: number;
  isFeatured: boolean;
  sortOrder: number;
  courseTitle: string;
  courseSlug: string;
  lessonPaths: string[];
}

export interface ILessonSeed {
  title: string;
  content: string;
  path: string;
}

export interface Lesson {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  videoId?: string;
  courseId: string;
  sortOrder: number;
  isPublished: boolean;
  isPreview: boolean;
}

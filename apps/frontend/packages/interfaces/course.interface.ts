export interface Course {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  communityId: string;
  sortOrder: number;
  isPublished: boolean;
  coverImageUrl?: string;
}

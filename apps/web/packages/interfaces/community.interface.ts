export interface Community {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  isFree: boolean;
  priceMonthly?: number;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  coverImageUrl?: string;
}

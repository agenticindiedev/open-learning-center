export interface ICommunityFormValues {
  title: string;
  slug: string;
  description: string;
  isFree: boolean;
  priceMonthly: number;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  coverImageUrl: string;
}

export interface ICommunityFormProps {
  initialValues: ICommunityFormValues;
  submitLabel: string;
  onSubmit: (values: ICommunityFormValues) => Promise<void>;
}

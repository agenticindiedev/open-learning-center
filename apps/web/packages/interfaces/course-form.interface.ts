import type { Community } from "@interfaces/community.interface";

export interface ICourseFormValues {
  title: string;
  slug: string;
  description: string;
  communityId: string;
  sortOrder: number;
  isPublished: boolean;
  coverImageUrl: string;
}

export interface ICourseFormProps {
  initialValues: ICourseFormValues;
  communities: Community[];
  submitLabel: string;
  onSubmit: (values: ICourseFormValues) => Promise<void>;
}

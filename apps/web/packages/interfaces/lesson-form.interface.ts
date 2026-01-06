import type { Course } from "@interfaces/course.interface";

export interface ILessonFormValues {
  title: string;
  slug: string;
  courseId: string;
  sortOrder: number;
  isPublished: boolean;
  isPreview: boolean;
  videoId: string;
  content: string;
}

export interface ILessonFormProps {
  initialValues: ILessonFormValues;
  courses: Course[];
  submitLabel: string;
  onSubmit: (values: ILessonFormValues) => Promise<void>;
}

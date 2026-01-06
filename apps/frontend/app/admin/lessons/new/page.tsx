"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LessonForm } from "@components/admin/lesson-form";
import { LessonService } from "@services/lesson.service";
import { CourseService } from "@services/course.service";
import type { Course } from "@interfaces/course.interface";
import type { ILessonFormValues } from "@interfaces/lesson-form.interface";

const DEFAULT_VALUES: ILessonFormValues = {
  title: "",
  slug: "",
  courseId: "",
  sortOrder: 0,
  isPublished: false,
  isPreview: false,
  videoId: "",
  content: "",
};

export default function NewLessonPage(): JSX.Element {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    CourseService.getAdminAll().then(setCourses).catch(() => setCourses([]));
  }, []);

  const handleSubmit = async (values: ILessonFormValues): Promise<void> => {
    const created = await LessonService.create(values);
    router.push(`/admin/lessons/${created._id}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">New lesson</h1>
      <LessonForm
        initialValues={DEFAULT_VALUES}
        courses={courses}
        submitLabel="Create lesson"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

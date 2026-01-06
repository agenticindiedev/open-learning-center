"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LessonForm } from "@components/admin/lesson-form";
import { LessonService } from "@services/lesson.service";
import { CourseService } from "@services/course.service";
import type { Lesson } from "@interfaces/lesson.interface";
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

function toFormValues(lesson: Lesson): ILessonFormValues {
  return {
    title: lesson.title,
    slug: lesson.slug || "",
    courseId: lesson.courseId,
    sortOrder: lesson.sortOrder || 0,
    isPublished: lesson.isPublished,
    isPreview: lesson.isPreview,
    videoId: lesson.videoId || "",
    content: lesson.content || "",
  };
}

export default function EditLessonPage(): JSX.Element {
  const params = useParams();
  const id = params.id as string;
  const [values, setValues] = useState<ILessonFormValues>(DEFAULT_VALUES);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    CourseService.getAdminAll().then(setCourses).catch(() => setCourses([]));
  }, []);

  useEffect(() => {
    LessonService.getAdminById(id)
      .then((lesson) => setValues(toFormValues(lesson)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (nextValues: ILessonFormValues): Promise<void> => {
    try {
      await LessonService.update(id, nextValues);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update lesson");
    }
  };

  if (loading) {
    return <div className="py-12 text-sm text-gray-500">Loading lesson...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit lesson</h1>
      <LessonForm
        initialValues={values}
        courses={courses}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

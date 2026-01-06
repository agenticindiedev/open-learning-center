"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CourseForm } from "@components/admin/course-form";
import { CourseService } from "@services/course.service";
import { CommunityService } from "@services/community.service";
import type { Course } from "@interfaces/course.interface";
import type { Community } from "@interfaces/community.interface";
import type { ICourseFormValues } from "@interfaces/course-form.interface";

const DEFAULT_VALUES: ICourseFormValues = {
  title: "",
  slug: "",
  description: "",
  communityId: "",
  sortOrder: 0,
  isPublished: false,
  coverImageUrl: "",
};

function toFormValues(course: Course): ICourseFormValues {
  return {
    title: course.title,
    slug: course.slug || "",
    description: course.description || "",
    communityId: course.communityId,
    sortOrder: course.sortOrder || 0,
    isPublished: course.isPublished,
    coverImageUrl: course.coverImageUrl || "",
  };
}

export default function EditCoursePage(): JSX.Element {
  const params = useParams();
  const id = params.id as string;
  const [values, setValues] = useState<ICourseFormValues>(DEFAULT_VALUES);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    CommunityService.getAdminAll().then(setCommunities).catch(() => setCommunities([]));
  }, []);

  useEffect(() => {
    CourseService.getAdminById(id)
      .then((course) => setValues(toFormValues(course)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (nextValues: ICourseFormValues): Promise<void> => {
    try {
      await CourseService.update(id, nextValues);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update course");
    }
  };

  if (loading) {
    return <div className="py-12 text-sm text-gray-500">Loading course...</div>;
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
      <h1 className="text-3xl font-bold text-gray-900">Edit course</h1>
      <CourseForm
        initialValues={values}
        communities={communities}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

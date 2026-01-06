"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CourseForm } from "@components/admin/course-form";
import { CourseService } from "@services/course.service";
import { CommunityService } from "@services/community.service";
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

export default function NewCoursePage(): JSX.Element {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    CommunityService.getAdminAll().then(setCommunities).catch(() => setCommunities([]));
  }, []);

  const handleSubmit = async (values: ICourseFormValues): Promise<void> => {
    const created = await CourseService.create(values);
    router.push(`/admin/courses/${created._id}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">New course</h1>
      <CourseForm
        initialValues={DEFAULT_VALUES}
        communities={communities}
        submitLabel="Create course"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

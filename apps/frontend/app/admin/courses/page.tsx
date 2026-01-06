"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@agenticindiedev/ui";
import { CourseService } from "@services/course.service";
import type { Course } from "@interfaces/course.interface";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    CourseService.getAdminAll()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-12 text-sm text-gray-500">Loading courses...</div>;
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <Link href="/admin/courses/new">
          <Button>New course</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course._id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {course.title}
              </h2>
              <p className="text-sm text-gray-500">/{course.slug}</p>
            </div>
            <Link
              href={`/admin/courses/${course._id}`}
              className="text-sm font-semibold text-blue-600"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CourseService } from "@services/course.service";
import type { Course } from "@interfaces/course.interface";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    CourseService.getAll(undefined, { signal: controller.signal })
      .then(setCourses)
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
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
      <h1 className="text-3xl font-bold text-gray-900">All courses</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <Link
            key={course._id}
            href={`/courses/${course.slug}`}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {course.title}
            </h2>
            {course.description && (
              <p className="mt-2 text-sm text-gray-600">
                {course.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

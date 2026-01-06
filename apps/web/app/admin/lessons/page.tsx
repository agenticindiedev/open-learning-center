"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@agenticindiedev/ui";
import { LessonService } from "@services/lesson.service";
import type { Lesson } from "@interfaces/lesson.interface";

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    LessonService.getAdminAll()
      .then(setLessons)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-12 text-sm text-gray-500">Loading lessons...</div>;
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
        <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
        <Link href="/admin/lessons/new">
          <Button>New lesson</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {lesson.title}
              </h2>
              <p className="text-sm text-gray-500">/{lesson.slug}</p>
            </div>
            <Link
              href={`/admin/lessons/${lesson._id}`}
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

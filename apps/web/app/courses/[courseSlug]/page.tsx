"use client";

import { Button } from "@shipshitdev/ui";
import { useSubscriptionStatus } from "@hooks/use-subscription-status";
import type { Course } from "@interfaces/course.interface";
import type { Lesson } from "@interfaces/lesson.interface";
import { CourseService } from "@services/course.service";
import { LessonService } from "@services/lesson.service";
import { SubscriptionService } from "@services/subscription.service";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseDetailPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const { isActive: isSubscribed } = useSubscriptionStatus();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadCourse = async () => {
      try {
        const data = await CourseService.getBySlug(courseSlug);
        if (!active) {
          return;
        }
        setCourse(data);
        const lessonData = await LessonService.getAll(data._id);
        if (!active) {
          return;
        }
        setLessons(lessonData);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load course");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCourse();

    return () => {
      active = false;
    };
  }, [courseSlug]);

  const handleSubscribe = async () => {
    try {
      const { url } = await SubscriptionService.createCheckout();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
    }
  };

  if (loading) {
    return <div className="py-12 text-sm text-gray-500">Loading course...</div>;
  }

  if (error || !course) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error || "Course not found"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          {!isSubscribed && <Button onClick={handleSubscribe}>Subscribe for full access</Button>}
        </div>
        {course.description && <p className="text-gray-600">{course.description}</p>}
        {!isSubscribed && (
          <p className="text-sm text-gray-500">
            You are viewing the preview lessons. Subscribe to unlock everything.
          </p>
        )}
      </div>

      <div className="space-y-3">
        {lessons.length === 0 ? (
          <div className="text-sm text-gray-500">No lessons yet.</div>
        ) : (
          lessons.map((lesson) => (
            <Link
              key={lesson._id}
              href={`/courses/${course.slug}/lessons/${lesson.slug}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                {lesson.isPreview && (
                  <span className="mt-2 inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    Preview
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">Open</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

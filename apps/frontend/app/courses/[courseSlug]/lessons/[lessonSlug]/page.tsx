"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@agenticindiedev/ui";
import { LessonService } from "@services/lesson.service";
import { SubscriptionService } from "@services/subscription.service";
import { ProgressService } from "@services/progress.service";
import { MarkdownRenderer } from "@components/markdown/markdown-renderer";
import type { Lesson } from "@interfaces/lesson.interface";

export default function LessonPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const lessonSlug = params.lessonSlug as string;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadLesson = async () => {
      try {
        const data = await LessonService.getBySlug(lessonSlug);
        if (!active) {
          return;
        }
        setLesson(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load lesson");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadLesson();

    return () => {
      active = false;
    };
  }, [lessonSlug]);

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

  const handleComplete = async () => {
    if (!lesson) {
      return;
    }

    try {
      await ProgressService.upsert(lesson._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save progress");
    }
  };

  if (loading) {
    return <div className="py-12 text-sm text-gray-500">Loading lesson...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
        <div className="mt-4">
          <Button onClick={handleSubscribe}>Subscribe for access</Button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return <div className="text-sm text-gray-500">Lesson not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/courses/${courseSlug}`} className="text-sm text-gray-500">
          Back to course
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">{lesson.title}</h1>
      </div>

      {lesson.videoId && (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            title={lesson.title}
            src={`https://www.youtube.com/embed/${lesson.videoId}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {lesson.content && <MarkdownRenderer content={lesson.content} />}

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleComplete}>Mark complete</Button>
        {lesson.isPreview && (
          <Button variant="ghost" onClick={handleSubscribe}>
            Subscribe for full access
          </Button>
        )}
      </div>
    </div>
  );
}

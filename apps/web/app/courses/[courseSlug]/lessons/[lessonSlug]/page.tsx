"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LessonService } from "@services/lesson.service";
import { SubscriptionService } from "@services/subscription.service";
import { ProgressService } from "@services/progress.service";
import { MarkdownRenderer } from "@components/markdown/markdown-renderer";
import { CommentList } from "@components/comments";
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
    return <div className="py-12 text-sm text-muted-foreground">Loading lesson...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleSubscribe}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Subscribe for access
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return <div className="text-sm text-muted-foreground">Lesson not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
      <div>
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to course
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-foreground">{lesson.title}</h1>
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
        <button
          type="button"
          onClick={handleComplete}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Mark complete
        </button>
        {lesson.isPreview && (
          <button
            type="button"
            onClick={handleSubscribe}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Subscribe for full access
          </button>
        )}
      </div>

      {/* Comments Section */}
      <div className="border-t border-border pt-8">
        <CommentList lessonId={lesson._id} />
      </div>
    </div>
  );
}

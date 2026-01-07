"use client";

import { Button, Loading } from "@agenticindiedev/ui";
import { useAuth } from "@clerk/nextjs";
import { MarkdownRenderer } from "@components/markdown/markdown-renderer";
import { useSubscriptionStatus } from "@hooks/use-subscription-status";
import type { Course } from "@interfaces/course.interface";
import type { Lesson } from "@interfaces/lesson.interface";
import type { Progress } from "@interfaces/progress.interface";
import { CourseService } from "@services/course.service";
import { ApiError, LessonService } from "@services/lesson.service";
import { ProgressService } from "@services/progress.service";
import { SubscriptionService } from "@services/subscription.service";
import { ArrowLeft, Check, CheckCircle, Circle, Lock, Play } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface LessonWithProgress extends Lesson {
  isCompleted: boolean;
  isLocked: boolean;
}

function LessonSidebar({
  course,
  lessons,
  currentLessonSlug,
  isSubscribed,
}: {
  course: Course;
  lessons: LessonWithProgress[];
  currentLessonSlug: string;
  isSubscribed: boolean;
}) {
  return (
    <aside className="hidden lg:block w-80 shrink-0 border-r border-border bg-card/50">
      <div className="sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto p-4">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          All courses
        </Link>

        <h2 className="font-semibold text-foreground mb-1">{course.title}</h2>
        <p className="text-xs text-muted-foreground mb-4">
          {lessons.filter((l) => l.isCompleted).length} / {lessons.length} completed
        </p>

        <nav className="space-y-1">
          {lessons.map((lesson, index) => {
            const isCurrent = lesson.slug === currentLessonSlug;
            const isAccessible =
              (lesson.isPreview || isSubscribed) && !lesson.isLocked;

            if (lesson.isLocked) {
              return (
                <div
                  key={lesson._id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 opacity-40"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="flex-1 text-sm text-muted-foreground truncate">
                    {lesson.title}
                  </span>
                </div>
              );
            }

            if (!isAccessible && !lesson.isPreview) {
              return (
                <div
                  key={lesson._id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 opacity-40"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="flex-1 text-sm text-muted-foreground truncate">
                    {lesson.title}
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={lesson._id}
                href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isCurrent
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                  {lesson.isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <span className="flex-1 text-sm truncate">{lesson.title}</span>
                {lesson.videoId && <Play className="h-3 w-3 shrink-0 opacity-50" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isActive: isSubscribed } = useSubscriptionStatus();
  const courseSlug = params.courseSlug as string;
  const lessonSlug = params.lessonSlug as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresSubscription, setRequiresSubscription] = useState(false);
  const [isMarkedComplete, setIsMarkedComplete] = useState(false);

  // Load course and lessons
  useEffect(() => {
    let active = true;

    const loadCourseData = async () => {
      try {
        const courseData = await CourseService.getBySlug(courseSlug);
        if (!active) return;
        setCourse(courseData);

        const lessonsData = await LessonService.getAll(courseData._id);
        if (!active) return;
        setLessons(lessonsData);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load course");
        }
      }
    };

    loadCourseData();
    return () => {
      active = false;
    };
  }, [courseSlug]);

  // Load progress
  useEffect(() => {
    if (!isSignedIn) {
      setProgress([]);
      return;
    }

    ProgressService.getMine()
      .then(setProgress)
      .catch(() => setProgress([]));
  }, [isSignedIn]);

  // Load current lesson
  useEffect(() => {
    let active = true;

    const loadLesson = async () => {
      setLoading(true);
      try {
        const data = await LessonService.getBySlug(lessonSlug);
        if (!active) return;
        setLesson(data);
        setRequiresSubscription(false);

        // Check if already completed
        const isAlreadyComplete = progress.some((p) => p.lessonId === data._id);
        setIsMarkedComplete(isAlreadyComplete);
      } catch (err) {
        if (!active) return;

        if (err instanceof ApiError && err.status === 403) {
          setRequiresSubscription(true);
          setError(null);
        } else {
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
  }, [lessonSlug, progress]);

  // Build lessons with progress and lock status
  const lessonsWithProgress = useMemo((): LessonWithProgress[] => {
    const completedIds = new Set(progress.map((p) => p.lessonId));

    return lessons.map((lesson, index) => {
      const isCompleted = completedIds.has(lesson._id);

      // First lesson is never locked
      // Subsequent lessons are locked if previous lesson is not completed (for subscribers)
      let isLocked = false;
      if (isSubscribed && index > 0) {
        const previousLesson = lessons[index - 1];
        const previousCompleted = completedIds.has(previousLesson._id);
        // Only lock if previous is NOT completed AND current is NOT a preview
        if (!previousCompleted && !lesson.isPreview) {
          isLocked = true;
        }
      }

      return { ...lesson, isCompleted, isLocked };
    });
  }, [lessons, progress, isSubscribed]);

  // Check if current lesson is locked
  const currentLessonData = lessonsWithProgress.find((l) => l.slug === lessonSlug);
  const isCurrentLocked = currentLessonData?.isLocked ?? false;

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }

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
    if (!lesson || !isSignedIn || !isSubscribed) {
      return;
    }

    try {
      const newProgress = await ProgressService.upsert(lesson._id);
      setProgress((prev) => [...prev, newProgress]);
      setIsMarkedComplete(true);

      // Navigate to next lesson if available
      const currentIndex = lessons.findIndex((l) => l._id === lesson._id);
      if (currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        router.push(`/courses/${courseSlug}/lessons/${nextLesson.slug}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save progress");
    }
  };

  const canMarkComplete = isSignedIn && isSubscribed && !isMarkedComplete;

  if (loading && !course) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center">
        <Loading variant="spinner" className="h-8 w-8" />
      </div>
    );
  }

  if (requiresSubscription || isCurrentLocked) {
    return (
      <div className="flex min-h-[calc(100vh-73px)]">
        {course && (
          <LessonSidebar
            course={course}
            lessons={lessonsWithProgress}
            currentLessonSlug={lessonSlug}
            isSubscribed={isSubscribed}
          />
        )}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {isCurrentLocked ? "Complete Previous Lesson" : "Premium Content"}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {isCurrentLocked
                ? "You need to complete the previous lesson before accessing this one."
                : "Subscribe to unlock all lessons and track your progress."}
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              {isCurrentLocked ? (
                <Button
                  onClick={() => {
                    const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug);
                    if (currentIndex > 0) {
                      const prevLesson = lessons[currentIndex - 1];
                      router.push(`/courses/${courseSlug}/lessons/${prevLesson.slug}`);
                    }
                  }}
                  size="lg"
                >
                  Go to Previous Lesson
                </Button>
              ) : (
                <Button onClick={handleSubscribe} size="lg">
                  {isSignedIn ? "Subscribe to Access" : "Sign In to Subscribe"}
                </Button>
              )}
              <Link
                href="/courses"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to courses
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!lesson) {
    return <div className="p-8 text-sm text-muted-foreground">Lesson not found.</div>;
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      {course && (
        <LessonSidebar
          course={course}
          lessons={lessonsWithProgress}
          currentLessonSlug={lessonSlug}
          isSubscribed={isSubscribed}
        />
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 lg:px-12">
          {/* Mobile back link */}
          <Link
            href="/courses"
            className="lg:hidden inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8">{lesson.title}</h1>

          {lesson.videoId && (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black mb-8">
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

          <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center gap-3">
            {canMarkComplete ? (
              <Button onClick={handleComplete} size="lg">
                Complete & Continue
              </Button>
            ) : isMarkedComplete ? (
              <Button variant="secondary" size="lg" disabled>
                <Check className="mr-2 h-4 w-4" />
                Completed
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleSubscribe}>
                {isSignedIn ? "Subscribe to track progress" : "Sign in to track progress"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

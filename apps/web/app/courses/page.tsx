"use client";

import { Button, Card, CardContent, CardHeader, Loading } from "@shipshitdev/ui";
import { useAuth } from "@clerk/nextjs";
import { RecentAchievements } from "@components/achievements";
import { useSubscriptionStatus } from "@hooks/use-subscription-status";
import type { Course } from "@interfaces/course.interface";
import type { Lesson } from "@interfaces/lesson.interface";
import { CourseService } from "@services/course.service";
import { LessonService } from "@services/lesson.service";
import { SubscriptionService } from "@services/subscription.service";
import { BookOpen, ChevronRight, Lock, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CourseWithLessons extends Course {
  lessons: Lesson[];
}
interface CourseCardProps {
  course: CourseWithLessons;
  isSubscribed: boolean;
  onSubscribe: () => void;
}

function CourseCard({ course, isSubscribed, onSubscribe }: CourseCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card variant="outline" hover className="overflow-hidden">
      <CardHeader className="pb-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{course.title}</h2>
              {course.description && (
                <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
              )}
            </div>
          </div>
          <ChevronRight
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-1">
            {course.lessons.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No modules available yet.
              </p>
            ) : (
              course.lessons.map((lesson, index) => {
                const isAccessible = lesson.isPreview || isSubscribed;

                if (isAccessible) {
                  return (
                    <Link
                      key={lesson._id}
                      href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground">
                        {index + 1}
                      </div>
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {lesson.title}
                      </span>
                      {lesson.videoId && <Play className="h-4 w-4 text-muted-foreground" />}
                      {lesson.isPreview && (
                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                          Free
                        </span>
                      )}
                    </Link>
                  );
                }

                return (
                  <div
                    key={lesson._id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 opacity-50"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      <Lock className="h-3.5 w-3.5" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-muted-foreground">
                      {lesson.title}
                    </span>
                    {lesson.videoId && <Play className="h-4 w-4 text-muted-foreground/50" />}
                  </div>
                );
              })
            )}
          </div>

          {!isSubscribed && (
            <div className="mt-4 border-t border-border pt-4">
              <Button size="sm" onClick={onSubscribe} className="w-full">
                Subscribe to unlock all modules
              </Button>
            </div>
          )}

          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">
              {course.lessons.length} {course.lessons.length === 1 ? "module" : "modules"}
              {!isSubscribed && (
                <span className="ml-1">
                  ({course.lessons.filter((l) => l.isPreview).length} free)
                </span>
              )}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function CoursesPage() {
  const { isSignedIn } = useAuth();
  const { isActive: isSubscribed, isLoading: isCheckingSubscription } = useSubscriptionStatus();
  const [courses, setCourses] = useState<CourseWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCoursesWithLessons() {
      try {
        const allCourses = await CourseService.getAll(undefined, { signal: controller.signal });

        const coursesWithLessons = await Promise.all(
          allCourses.map(async (course) => {
            try {
              const lessons = await LessonService.getAll(course._id, { signal: controller.signal });
              return { ...course, lessons };
            } catch {
              return { ...course, lessons: [] };
            }
          })
        );

        setCourses(coursesWithLessons);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadCoursesWithLessons();

    return () => controller.abort();
  }, []);

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

  if (loading || isCheckingSubscription) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 flex items-center justify-center min-h-[50vh]">
        <Loading variant="spinner" className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Your Learning Path</h1>
        <p className="mt-2 text-muted-foreground">
          Pick a course and start learning. Each module builds on the previous one.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - courses */}
        <div className="lg:col-span-2">
          {courses.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
              <p className="text-muted-foreground">No courses available yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isSubscribed={isSubscribed}
                  onSubscribe={handleSubscribe}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - achievements widget */}
        {isSignedIn && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <RecentAchievements />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

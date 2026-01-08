"use client";

import { Button, Card, CardContent } from "@shipshitdev/ui";
import type { Lesson } from "@interfaces/lesson.interface";
import { LessonService } from "@services/lesson.service";
import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    return <div className="py-12 text-sm text-muted-foreground">Loading lessons...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lessons</h1>
          <p className="mt-1 text-muted-foreground">Write and edit individual lessons</p>
        </div>
        <Link href="/admin/lessons/new">
          <Button>New lesson</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {lessons.length === 0 ? (
          <Card variant="outline">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No lessons yet</p>
              <Link href="/admin/lessons/new" className="mt-4">
                <Button>Create your first lesson</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          lessons.map((lesson) => (
            <Link key={lesson._id} href={`/admin/lessons/${lesson._id}`}>
              <Card
                variant="outline"
                hover
                className="group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                      <BookOpen className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {lesson.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">/{lesson.slug}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

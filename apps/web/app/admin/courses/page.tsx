"use client";

import { Button, Card, CardContent } from "@shipshitdev/ui";
import type { Course } from "@interfaces/course.interface";
import { CourseService } from "@services/course.service";
import { ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    return <div className="py-12 text-sm text-muted-foreground">Loading courses...</div>;
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
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="mt-1 text-muted-foreground">Build and organize course content</p>
        </div>
        <Link href="/admin/courses/new">
          <Button>New course</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {courses.length === 0 ? (
          <Card variant="outline">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No courses yet</p>
              <Link href="/admin/courses/new" className="mt-4">
                <Button>Create your first course</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Link key={course._id} href={`/admin/courses/${course._id}`}>
              <Card
                variant="outline"
                hover
                className="group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                      <GraduationCap className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {course.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">/{course.slug}</p>
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

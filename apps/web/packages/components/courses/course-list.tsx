"use client";

import { Button } from "@shipshitdev/ui";
import type { Course } from "@interfaces/course.interface";
import { CourseService } from "@services/course.service";
import { useEffect, useState } from "react";

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const data = await CourseService.getAll(undefined, { signal: controller.signal });
      setCourses(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (id: string) => {
    try {
      await CourseService.delete(id);
      fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Courses</h2>
        <Button
          onClick={() => {
            window.location.href = "/courses/new";
          }}
        >
          Add Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No courses yet. Create your first one!</div>
      ) : (
        <div className="space-y-2">
          {courses.map((course) => (
            <div
              key={course._id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{course.title}</h3>
                {course.description && (
                  <p className="text-sm text-gray-500">{course.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    window.location.href = `/courses/${course._id}`;
                  }}
                >
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => handleDelete(course._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

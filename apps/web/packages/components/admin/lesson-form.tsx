"use client";

import { useEffect, useState } from "react";
import { Button } from "@agenticindiedev/ui";
import { MarkdownEditor } from "@components/markdown/markdown-editor";

import type {
  ILessonFormProps,
  ILessonFormValues,
} from "@interfaces/lesson-form.interface";

const EMPTY_VALUES: ILessonFormValues = {
  title: "",
  slug: "",
  courseId: "",
  sortOrder: 0,
  isPublished: false,
  isPreview: false,
  videoId: "",
  content: "",
};

export function LessonForm({
  initialValues,
  courses,
  submitLabel,
  onSubmit,
}: ILessonFormProps): JSX.Element {
  const [values, setValues] = useState<ILessonFormValues>(EMPTY_VALUES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues({ ...EMPTY_VALUES, ...initialValues });
  }, [initialValues]);

  const handleChange = (
    field: keyof ILessonFormValues,
    value: string | number | boolean,
  ): void => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (): Promise<void> => {
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Title</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.title}
            onChange={(event) => handleChange("title", event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Slug</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.slug}
            onChange={(event) => handleChange("slug", event.target.value)}
            placeholder="leave blank to auto-generate"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Course</span>
          <select
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.courseId}
            onChange={(event) => handleChange("courseId", event.target.value)}
          >
            <option value="">Select</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Sort order</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            type="number"
            value={values.sortOrder}
            onChange={(event) =>
              handleChange("sortOrder", Number(event.target.value))
            }
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-semibold">YouTube video ID</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.videoId}
            onChange={(event) => handleChange("videoId", event.target.value)}
            placeholder="e.g. dQw4w9WgXcQ"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={values.isPublished}
            onChange={(event) => handleChange("isPublished", event.target.checked)}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={values.isPreview}
            onChange={(event) => handleChange("isPreview", event.target.checked)}
          />
          Preview lesson
        </label>
      </div>

      <MarkdownEditor
        value={values.content}
        onChange={(next) => handleChange("content", next)}
      />

      <Button onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}

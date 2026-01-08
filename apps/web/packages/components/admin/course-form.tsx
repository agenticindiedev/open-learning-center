"use client";

import { Button } from "@shipshitdev/ui";
import type { ICourseFormProps, ICourseFormValues } from "@interfaces/course-form.interface";
import { useEffect, useState } from "react";

const EMPTY_VALUES: ICourseFormValues = {
  title: "",
  slug: "",
  description: "",
  communityId: "",
  sortOrder: 0,
  isPublished: false,
  coverImageUrl: "",
};

export function CourseForm({
  initialValues,
  communities,
  submitLabel,
  onSubmit,
}: ICourseFormProps) {
  const [values, setValues] = useState<ICourseFormValues>(EMPTY_VALUES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues({ ...EMPTY_VALUES, ...initialValues });
  }, [initialValues]);

  const handleChange = (field: keyof ICourseFormValues, value: string | number | boolean): void => {
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

      <label className="space-y-2 text-sm">
        <span className="font-semibold">Description</span>
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-gray-200 p-2"
          value={values.description}
          onChange={(event) => handleChange("description", event.target.value)}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Community</span>
          <select
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.communityId}
            onChange={(event) => handleChange("communityId", event.target.value)}
          >
            <option value="">Select</option>
            {communities.map((community) => (
              <option key={community._id} value={community._id}>
                {community.title}
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
            onChange={(event) => handleChange("sortOrder", Number(event.target.value))}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Cover image</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.coverImageUrl}
            onChange={(event) => handleChange("coverImageUrl", event.target.value)}
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={values.isPublished}
          onChange={(event) => handleChange("isPublished", event.target.checked)}
        />
        Published
      </label>

      <Button onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}

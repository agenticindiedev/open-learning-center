"use client";

import { useEffect, useState } from "react";
import { Button } from "@agenticindiedev/ui";

import type {
  ICommunityFormProps,
  ICommunityFormValues,
} from "@interfaces/community-form.interface";

const EMPTY_VALUES: ICommunityFormValues = {
  title: "",
  slug: "",
  description: "",
  isFree: false,
  priceMonthly: 49,
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
  coverImageUrl: "",
};

export function CommunityForm({
  initialValues,
  submitLabel,
  onSubmit,
}: ICommunityFormProps): JSX.Element {
  const [values, setValues] = useState<ICommunityFormValues>(EMPTY_VALUES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues({ ...EMPTY_VALUES, ...initialValues });
  }, [initialValues]);

  const handleChange = (
    field: keyof ICommunityFormValues,
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
          <span className="font-semibold">Price (monthly)</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            type="number"
            value={values.priceMonthly}
            onChange={(event) =>
              handleChange("priceMonthly", Number(event.target.value))
            }
            disabled={values.isFree}
          />
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
          <span className="font-semibold">Cover image</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.coverImageUrl}
            onChange={(event) => handleChange("coverImageUrl", event.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={values.isFree}
            onChange={(event) => handleChange("isFree", event.target.checked)}
          />
          Free community
        </label>
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
            checked={values.isFeatured}
            onChange={(event) => handleChange("isFeatured", event.target.checked)}
          />
          Featured
        </label>
      </div>

      <Button onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}

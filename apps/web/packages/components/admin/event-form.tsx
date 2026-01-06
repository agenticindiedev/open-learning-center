"use client";

import { useEffect, useState } from "react";
import { Button } from "@agenticindiedev/ui";

import type {
  IEventFormProps,
  IEventFormValues,
} from "@interfaces/event-form.interface";

const EMPTY_VALUES: IEventFormValues = {
  title: "",
  description: "",
  startsAt: "",
  endsAt: "",
  meetUrl: "",
  communityId: "",
  isPaidOnly: false,
  isPublished: false,
};

export function EventForm({
  initialValues,
  communities,
  submitLabel,
  onSubmit,
}: IEventFormProps): JSX.Element {
  const [values, setValues] = useState<IEventFormValues>(EMPTY_VALUES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues({ ...EMPTY_VALUES, ...initialValues });
  }, [initialValues]);

  const handleChange = (
    field: keyof IEventFormValues,
    value: string | boolean,
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
          <span className="font-semibold">Google Meet URL</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.meetUrl}
            onChange={(event) => handleChange("meetUrl", event.target.value)}
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
          <span className="font-semibold">Starts at</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            type="datetime-local"
            value={values.startsAt}
            onChange={(event) => handleChange("startsAt", event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Ends at</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            type="datetime-local"
            value={values.endsAt}
            onChange={(event) => handleChange("endsAt", event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Community (optional)</span>
          <select
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.communityId}
            onChange={(event) => handleChange("communityId", event.target.value)}
          >
            <option value="">General</option>
            {communities.map((community) => (
              <option key={community._id} value={community._id}>
                {community.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={values.isPaidOnly}
            onChange={(event) => handleChange("isPaidOnly", event.target.checked)}
          />
          Paid only
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={values.isPublished}
            onChange={(event) => handleChange("isPublished", event.target.checked)}
          />
          Published
        </label>
      </div>

      <Button onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EventForm } from "@components/admin/event-form";
import { EventService } from "@services/event.service";
import { CommunityService } from "@services/community.service";
import type { Event } from "@interfaces/event.interface";
import type { Community } from "@interfaces/community.interface";
import type { IEventFormValues } from "@interfaces/event-form.interface";

const DEFAULT_VALUES: IEventFormValues = {
  title: "",
  description: "",
  startsAt: "",
  endsAt: "",
  meetUrl: "",
  communityId: "",
  isPaidOnly: false,
  isPublished: false,
};

function toInputValue(dateValue?: string): string {
  if (!dateValue) {
    return "";
  }
  const date = new Date(dateValue);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function toFormValues(event: Event): IEventFormValues {
  return {
    title: event.title,
    description: event.description || "",
    startsAt: toInputValue(event.startsAt),
    endsAt: toInputValue(event.endsAt),
    meetUrl: event.meetUrl || "",
    communityId: event.communityId || "",
    isPaidOnly: event.isPaidOnly,
    isPublished: event.isPublished,
  };
}

function toApiPayload(values: IEventFormValues): Partial<Event> {
  return {
    ...values,
    startsAt: values.startsAt ? new Date(values.startsAt).toISOString() : undefined,
    endsAt: values.endsAt ? new Date(values.endsAt).toISOString() : undefined,
  };
}

export default function EditEventPage(): JSX.Element {
  const params = useParams();
  const id = params.id as string;
  const [values, setValues] = useState<IEventFormValues>(DEFAULT_VALUES);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    CommunityService.getAdminAll().then(setCommunities).catch(() => setCommunities([]));
  }, []);

  useEffect(() => {
    EventService.getAdminById(id)
      .then((event) => setValues(toFormValues(event)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (nextValues: IEventFormValues): Promise<void> => {
    try {
      await EventService.update(id, toApiPayload(nextValues));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    }
  };

  if (loading) {
    return <div className="py-12 text-sm text-gray-500">Loading event...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit event</h1>
      <EventForm
        initialValues={values}
        communities={communities}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

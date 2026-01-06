"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "@components/admin/event-form";
import { EventService } from "@services/event.service";
import { CommunityService } from "@services/community.service";
import type { Community } from "@interfaces/community.interface";
import type { Event } from "@interfaces/event.interface";
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

function toApiPayload(values: IEventFormValues): Partial<Event> {
  return {
    ...values,
    startsAt: values.startsAt ? new Date(values.startsAt).toISOString() : undefined,
    endsAt: values.endsAt ? new Date(values.endsAt).toISOString() : undefined,
  };
}

export default function NewEventPage(): JSX.Element {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    CommunityService.getAdminAll().then(setCommunities).catch(() => setCommunities([]));
  }, []);

  const handleSubmit = async (values: IEventFormValues): Promise<void> => {
    const created = await EventService.create(toApiPayload(values));
    router.push(`/admin/events/${created._id}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">New event</h1>
      <EventForm
        initialValues={DEFAULT_VALUES}
        communities={communities}
        submitLabel="Create event"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

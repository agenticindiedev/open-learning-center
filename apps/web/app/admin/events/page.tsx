"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@agenticindiedev/ui";
import { EventService } from "@services/event.service";
import type { Event } from "@interfaces/event.interface";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    EventService.getAdminAll()
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-12 text-sm text-gray-500">Loading events...</div>;
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <Link href="/admin/events/new">
          <Button>New event</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event._id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {event.title}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(event.startsAt).toLocaleString()}
              </p>
            </div>
            <Link
              href={`/admin/events/${event._id}`}
              className="text-sm font-semibold text-blue-600"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

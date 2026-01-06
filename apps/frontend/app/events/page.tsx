"use client";

import { useEffect, useState } from "react";
import { Button } from "@agenticindiedev/ui";
import { EventService } from "@services/event.service";
import { SubscriptionService } from "@services/subscription.service";
import { useSubscriptionStatus } from "@hooks/use-subscription-status";
import type { Event } from "@interfaces/event.interface";

export default function EventsPage() {
  const { isActive: isSubscribed } = useSubscriptionStatus();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    EventService.getAll()
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async () => {
    try {
      const { url } = await SubscriptionService.createCheckout();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
    }
  };

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live sessions</h1>
        <p className="mt-2 text-gray-600">Upcoming group calls and workshops.</p>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-sm text-gray-500">No events scheduled yet.</div>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {event.title}
                  </h2>
                  {event.description && (
                    <p className="mt-2 text-sm text-gray-600">
                      {event.description}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-gray-500">
                    {new Date(event.startsAt).toLocaleString()}
                  </p>
                </div>
                {event.meetUrl ? (
                  <a
                    href={event.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-blue-600"
                  >
                    Join meeting
                  </a>
                ) : (
                  <Button onClick={handleSubscribe} disabled={isSubscribed}>
                    {isSubscribed ? "Subscribed" : "Subscribe for access"}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

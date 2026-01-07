"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, Skeleton } from "@agenticindiedev/ui";
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
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="mt-2 h-5 w-72" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Sessions</h1>
          <p className="mt-2 text-muted-foreground">Upcoming group calls and workshops.</p>
        </div>

        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-sm text-muted-foreground">No events scheduled yet.</div>
          ) : (
            events.map((event) => (
              <Card key={event._id} variant="outline" hover>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {event.title}
                      </h2>
                      {event.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                      <p className="mt-3 text-sm text-muted-foreground">
                        {new Date(event.startsAt).toLocaleString()}
                      </p>
                    </div>
                    {event.meetUrl ? (
                      <Button asChild variant="primary" size="sm">
                        <a href={event.meetUrl} target="_blank" rel="noreferrer">
                          Join meeting
                        </a>
                      </Button>
                    ) : (
                      <Button
                        variant={isSubscribed ? "secondary" : "primary"}
                        size="sm"
                        onClick={handleSubscribe}
                        disabled={isSubscribed}
                      >
                        {isSubscribed ? "Subscribed" : "Subscribe for access"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

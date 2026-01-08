"use client";

import { Button, Card, CardContent } from "@shipshitdev/ui";
import type { Event } from "@interfaces/event.interface";
import { EventService } from "@services/event.service";
import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    return <div className="py-12 text-sm text-muted-foreground">Loading events...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="mt-1 text-muted-foreground">Schedule and manage live events</p>
        </div>
        <Link href="/admin/events/new">
          <Button>New event</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {events.length === 0 ? (
          <Card variant="outline">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No events yet</p>
              <Link href="/admin/events/new" className="mt-4">
                <Button>Create your first event</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Link key={event._id} href={`/admin/events/${event._id}`}>
              <Card
                variant="outline"
                hover
                className="group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20">
                      <Calendar className="h-5 w-5 text-sky-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {event.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.startsAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { Button, Card, CardContent, Loading } from "@shipshitdev/ui";
import type { Event } from "@interfaces/event.interface";
import { EventService } from "@services/event.service";
import { Calendar, Clock, ExternalLink, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TabType = "upcoming" | "past";

function EventCard({ event, isPast }: { event: Event; isPast: boolean }) {
  const eventDate = new Date(event.startsAt);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card variant="outline" hover className={isPast ? "opacity-60" : ""}>
      <CardContent className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">{event.title}</h2>
              {!isPast && (
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                  Upcoming
                </span>
              )}
            </div>
            {event.description && (
              <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formattedTime}
              </div>
            </div>
          </div>
          {event.meetUrl && (
            <Button
              asChild
              variant={isPast ? "secondary" : "primary"}
              size="sm"
              className="shrink-0"
            >
              <a href={event.meetUrl} target="_blank" rel="noreferrer" className="gap-2">
                {isPast ? (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    View Recording
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4" />
                    Join Meeting
                  </>
                )}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  useEffect(() => {
    EventService.getAll()
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming: Event[] = [];
    const past: Event[] = [];

    for (const event of events) {
      const eventDate = new Date(event.startsAt);
      if (eventDate > now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    }

    // Sort upcoming by date ascending (soonest first)
    upcoming.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    // Sort past by date descending (most recent first)
    past.sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  const displayedEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 flex items-center justify-center min-h-[50vh]">
        <Loading variant="spinner" className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Live Sessions</h1>
        <p className="mt-2 text-muted-foreground">
          Join live workshops and group calls. Past sessions are available as recordings.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1">
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "upcoming"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Upcoming
          {upcomingEvents.length > 0 && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {upcomingEvents.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("past")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "past"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Past Sessions
          {pastEvents.length > 0 && (
            <span className="ml-2 rounded-full bg-muted-foreground/10 px-2 py-0.5 text-xs">
              {pastEvents.length}
            </span>
          )}
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {displayedEvents.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
            <p className="text-muted-foreground">
              {activeTab === "upcoming"
                ? "No upcoming events scheduled yet."
                : "No past sessions available."}
            </p>
          </div>
        ) : (
          displayedEvents.map((event) => (
            <EventCard key={event._id} event={event} isPast={activeTab === "past"} />
          ))
        )}
      </div>
    </div>
  );
}

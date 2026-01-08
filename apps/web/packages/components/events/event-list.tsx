"use client";

import { Button } from "@shipshitdev/ui";
import type { Event } from "@interfaces/event.interface";
import { EventService } from "@services/event.service";
import { useEffect, useState } from "react";

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const data = await EventService.getAll({ signal: controller.signal });
      setEvents(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    EventService.getAll({ signal: controller.signal })
      .then(setEvents)
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await EventService.delete(id);
      fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events</h2>
        <Button
          onClick={() => {
            window.location.href = "/events/new";
          }}
        >
          Add Event
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No events yet. Create your first one!</div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event._id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{event.title}</h3>
                {event.description && <p className="text-sm text-gray-500">{event.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    window.location.href = `/events/${event._id}`;
                  }}
                >
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => handleDelete(event._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

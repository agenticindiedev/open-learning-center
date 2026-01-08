"use client";

import { Button } from "@shipshitdev/ui";
import type { Subscription } from "@interfaces/subscription.interface";
import { SubscriptionService } from "@services/subscription.service";
import { useEffect, useState } from "react";

export function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const data = await SubscriptionService.getMine({ signal: controller.signal });
      setSubscriptions(data);
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

    SubscriptionService.getMine({ signal: controller.signal })
      .then(setSubscriptions)
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await SubscriptionService.cancel(id);
      fetchSubscriptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel");
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
        <h2 className="text-2xl font-bold">My Subscriptions</h2>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No subscriptions yet.</div>
      ) : (
        <div className="space-y-2">
          {subscriptions.map((subscription) => (
            <div
              key={subscription._id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">Status: {subscription.status}</h3>
                {subscription.currentPeriodEnd && (
                  <p className="text-sm text-gray-500">
                    Renews: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {!subscription.cancelAtPeriodEnd && (
                  <Button variant="ghost" onClick={() => handleCancel(subscription._id)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

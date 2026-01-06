"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { SubscriptionService } from "@services/subscription.service";
import type { Subscription } from "@interfaces/subscription.interface";
import type { ISubscriptionStatus } from "@interfaces/subscription-status.interface";

export function useSubscriptionStatus(): ISubscriptionStatus {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (!isSignedIn) {
      setSubscriptions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    SubscriptionService.getMine()
      .then(setSubscriptions)
      .catch(() => setSubscriptions([]))
      .finally(() => setIsLoading(false));
  }, [isSignedIn]);

  const isActive = subscriptions.some(
    (subscription) => subscription.status === "active",
  );

  return { isLoading, isActive };
}

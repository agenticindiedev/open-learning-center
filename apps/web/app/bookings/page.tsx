"use client";

import { Button } from "@shipshitdev/ui";
import { useSubscriptionStatus } from "@hooks/use-subscription-status";
import { SubscriptionService } from "@services/subscription.service";

export default function BookingsPage() {
  const { isActive: isSubscribed } = useSubscriptionStatus();
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "";

  const handleSubscribe = async () => {
    const { url } = await SubscriptionService.createCheckout();
    if (url) {
      window.location.href = url;
    }
  };

  if (!isSubscribed) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Book a 1-1</h1>
        <p className="text-gray-600">1-1 sessions are available to paid members only.</p>
        <Button onClick={handleSubscribe}>Subscribe to book</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Book a 1-1</h1>
        <p className="mt-2 text-gray-600">Pick a time that works.</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        {calendlyUrl ? (
          <iframe title="Calendly booking" src={calendlyUrl} className="h-[700px] w-full" />
        ) : (
          <div className="p-6 text-sm text-gray-500">Calendly link is not configured.</div>
        )}
      </div>
    </div>
  );
}

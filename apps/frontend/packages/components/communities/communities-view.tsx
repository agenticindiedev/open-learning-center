"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@agenticindiedev/ui";
import { CommunityService } from "@services/community.service";
import { MembershipService } from "@services/membership.service";
import { SubscriptionService } from "@services/subscription.service";
import { useSubscriptionStatus } from "@hooks/use-subscription-status";
import type { Community } from "@interfaces/community.interface";
import type { Membership } from "@interfaces/membership.interface";
import type { ICommunityCardProps } from "@interfaces/community-card.interface";

function CommunityCard({
  community,
  isSubscribed,
  joinedIds,
  onJoin,
  onSubscribe,
}: ICommunityCardProps): JSX.Element {
  const isFree = community.isFree;
  const isJoined = joinedIds.has(community._id);
  const price = community.priceMonthly || 49;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {community.title}
          </h3>
          {community.description && (
            <p className="mt-2 text-sm text-gray-600">
              {community.description}
            </p>
          )}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isFree ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {isFree ? "Free" : `$${price}/mo`}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href={`/communities/${community.slug}`} className="text-sm font-semibold">
          View community
        </Link>
        {isFree ? (
          <Button
            onClick={() => onJoin(community._id)}
            disabled={isJoined}
          >
            {isJoined ? "Joined" : "Join free"}
          </Button>
        ) : (
          <Button onClick={onSubscribe} disabled={isSubscribed}>
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        )}
      </div>
    </div>
  );
}

export function CommunitiesView(): JSX.Element {
  const { isSignedIn } = useAuth();
  const { isActive: isSubscribed } = useSubscriptionStatus();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const joinedIds = useMemo(
    () => new Set(memberships.map((membership) => membership.communityId)),
    [memberships],
  );

  useEffect((): (() => void) => {
    const controller = new AbortController();

    CommunityService.getAll({ signal: controller.signal })
      .then(setCommunities)
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect((): void => {
    if (!isSignedIn) {
      setMemberships([]);
      return;
    }

    MembershipService.getMine()
      .then(setMemberships)
      .catch(() => setMemberships([]));
  }, [isSignedIn]);

  const handleJoin = async (communityId: string): Promise<void> => {
    if (!isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }

    try {
      await MembershipService.join(communityId);
      const updated = await MembershipService.getMine();
      setMemberships(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join community");
    }
  };

  const handleSubscribe = async (): Promise<void> => {
    if (!isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }

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
    return <div className="py-12 text-sm text-gray-500">Loading communities...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Open Learning Center</h1>
        <p className="mt-2 text-gray-600">
          Pick a community, learn fast, and ship real work.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {communities.map((community) => (
          <CommunityCard
            key={community._id}
            community={community}
            isSubscribed={isSubscribed}
            joinedIds={joinedIds}
            onJoin={handleJoin}
            onSubscribe={handleSubscribe}
          />
        ))}
      </div>
    </div>
  );
}

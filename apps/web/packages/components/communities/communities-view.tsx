"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Badge, Button, Card, CardContent, Skeleton } from "@agenticindiedev/ui";
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
    <Card variant="outline" hover className="p-6">
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {community.title}
            </h3>
            {community.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {community.description}
              </p>
            )}
          </div>
          <Badge variant={isFree ? "success" : "secondary"}>
            {isFree ? "Free" : `$${price}/mo`}
          </Badge>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/communities/${community.slug}`}
            className="text-sm font-semibold text-primary hover:text-primary/80"
          >
            View community
          </Link>
          {isFree ? (
            <Button
              variant={isJoined ? "secondary" : "primary"}
              size="sm"
              onClick={() => onJoin(community._id)}
              disabled={isJoined}
            >
              {isJoined ? "Joined" : "Join free"}
            </Button>
          ) : (
            <Button
              variant={isSubscribed ? "secondary" : "primary"}
              size="sm"
              onClick={onSubscribe}
              disabled={isSubscribed}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CommunityCardSkeleton(): JSX.Element {
  return (
    <Card variant="outline" className="p-6">
      <CardContent className="p-0 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
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
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-2 h-5 w-72" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <CommunityCardSkeleton />
          <CommunityCardSkeleton />
          <CommunityCardSkeleton />
        </div>
      </div>
    );
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Communities</h1>
        <p className="mt-2 text-muted-foreground">
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

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@agenticindiedev/ui";
import { CommunityService } from "@services/community.service";
import { CourseService } from "@services/course.service";
import { MembershipService } from "@services/membership.service";
import { SubscriptionService } from "@services/subscription.service";
import { useSubscriptionStatus } from "@hooks/use-subscription-status";
import type { Community } from "@interfaces/community.interface";
import type { Course } from "@interfaces/course.interface";
import type { Membership } from "@interfaces/membership.interface";

export default function CommunityDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isSignedIn } = useAuth();
  const { isActive: isSubscribed } = useSubscriptionStatus();
  const [community, setCommunity] = useState<Community | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const joinedIds = useMemo(
    () => new Set(memberships.map((membership) => membership.communityId)),
    [memberships],
  );

  useEffect(() => {
    let active = true;

    const loadCommunity = async () => {
      try {
        const data = await CommunityService.getBySlug(slug);
        if (!active) {
          return;
        }
        setCommunity(data);
        const courseData = await CourseService.getAll(data._id);
        if (!active) {
          return;
        }
        setCourses(courseData);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load community");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCommunity();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!isSignedIn) {
      setMemberships([]);
      return;
    }

    MembershipService.getMine()
      .then(setMemberships)
      .catch(() => setMemberships([]));
  }, [isSignedIn]);

  const handleJoin = async () => {
    if (!community) {
      return;
    }

    if (!isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }

    try {
      await MembershipService.join(community._id);
      const updated = await MembershipService.getMine();
      setMemberships(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join community");
    }
  };

  const handleSubscribe = async () => {
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
    return <div className="py-12 text-sm text-gray-500">Loading community...</div>;
  }

  if (error || !community) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error || "Community not found"}
      </div>
    );
  }

  const isFree = community.isFree;
  const isJoined = joinedIds.has(community._id);
  const price = community.priceMonthly || 49;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{community.title}</h1>
          {community.description && (
            <p className="mt-2 text-gray-600">{community.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            {isFree ? "Free" : `$${price}/mo`}
          </span>
          {isFree ? (
            <Button onClick={handleJoin} disabled={isJoined}>
              {isJoined ? "Joined" : "Join free"}
            </Button>
          ) : (
            <Button onClick={handleSubscribe} disabled={isSubscribed}>
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900">Courses</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {courses.length === 0 ? (
            <div className="text-sm text-gray-500">No courses yet.</div>
          ) : (
            courses.map((course) => (
              <Link
                key={course._id}
                href={`/courses/${course.slug}`}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {course.description}
                  </p>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

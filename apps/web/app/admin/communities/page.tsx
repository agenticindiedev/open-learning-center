"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@agenticindiedev/ui";
import { CommunityService } from "@services/community.service";
import type { Community } from "@interfaces/community.interface";

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    CommunityService.getAdminAll()
      .then(setCommunities)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
        <Link href="/admin/communities/new">
          <Button>New community</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {communities.map((community) => (
          <div
            key={community._id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {community.title}
              </h2>
              <p className="text-sm text-gray-500">/{community.slug}</p>
            </div>
            <Link
              href={`/admin/communities/${community._id}`}
              className="text-sm font-semibold text-blue-600"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

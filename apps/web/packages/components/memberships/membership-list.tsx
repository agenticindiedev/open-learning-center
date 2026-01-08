"use client";

import { Button } from "@shipshitdev/ui";
import type { Membership } from "@interfaces/membership.interface";
import { MembershipService } from "@services/membership.service";
import { useEffect, useState } from "react";

export function MembershipList() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const data = await MembershipService.getMine({ signal: controller.signal });
      setMemberships(data);
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

    MembershipService.getMine({ signal: controller.signal })
      .then(setMemberships)
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
      await MembershipService.delete(id);
      fetchMemberships();
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
        <h2 className="text-2xl font-bold">My Memberships</h2>
      </div>

      {memberships.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No memberships yet. Create your first one!
        </div>
      ) : (
        <div className="space-y-2">
          {memberships.map((membership) => (
            <div
              key={membership._id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">Community: {membership.communityId}</h3>
                <p className="text-sm text-gray-500">Status: {membership.status}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => handleDelete(membership._id)}>
                  Leave
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CommunityService } from "@services/community.service";
import { Community } from "@interfaces/community.interface";
import { Button } from "@agenticindiedev/ui";

export function CommunityList() {
  const [communities, setCommunitys] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunitys = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const data = await CommunityService.getAll({ signal: controller.signal });
      setCommunitys(data);
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

    CommunityService.getAll({ signal: controller.signal })
      .then(setCommunitys)
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
      await CommunityService.delete(id);
      fetchCommunitys();
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
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Communitys</h2>
        <Button onClick={() => window.location.href = "/communities/new"}>
          Add Community
        </Button>
      </div>

      {communities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No communities yet. Create your first one!
        </div>
      ) : (
        <div className="space-y-2">
          {communities.map((community) => (
            <div key={community._id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-medium">{community.title}</h3>
                {community.description && (
                  <p className="text-sm text-gray-500">{community.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => window.location.href = `/communities/${community._id}`}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(community._id)}
                >
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

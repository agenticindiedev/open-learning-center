"use client";

import { useEffect, useState } from "react";
import { ProgressService } from "@services/progress.service";
import { Progress } from "@interfaces/progress.interface";
import { Button } from "@agenticindiedev/ui";

export function ProgressList() {
  const [progresses, setProgresss] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgresss = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const data = await ProgressService.getAll({ signal: controller.signal });
      setProgresss(data);
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

    ProgressService.getAll({ signal: controller.signal })
      .then(setProgresss)
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
      await ProgressService.delete(id);
      fetchProgresss();
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
        <h2 className="text-2xl font-bold">Progresss</h2>
        <Button onClick={() => window.location.href = "/progresses/new"}>
          Add Progress
        </Button>
      </div>

      {progresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No progresses yet. Create your first one!
        </div>
      ) : (
        <div className="space-y-2">
          {progresses.map((progress) => (
            <div key={progress._id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-medium">{progress.title}</h3>
                {progress.description && (
                  <p className="text-sm text-gray-500">{progress.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => window.location.href = `/progresses/${progress._id}`}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(progress._id)}
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

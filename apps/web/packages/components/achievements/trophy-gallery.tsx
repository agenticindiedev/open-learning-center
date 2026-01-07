"use client";

import type { AchievementCategory, AchievementWithStatus } from "@interfaces/achievement.interface";
import { AchievementService } from "@services/achievement.service";
import { Boxes, MessageCircle, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { TrophyCard } from "./trophy-card";

const categoryConfig: Record<
  AchievementCategory,
  { label: string; icon: typeof Rocket; description: string }
> = {
  completion: {
    label: "Completion",
    icon: Rocket,
    description: "Earned by completing lessons and courses",
  },
  shipping: {
    label: "Shipping",
    icon: Boxes,
    description: "Earned by completing project lessons",
  },
  engagement: {
    label: "Engagement",
    icon: MessageCircle,
    description: "Earned through community participation",
  },
};

export function TrophyGallery() {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | "all">("all");

  useEffect(() => {
    const controller = new AbortController();

    AchievementService.getAllWithStatus({ signal: controller.signal })
      .then(setAchievements)
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const earnedCount = achievements.filter((a) => a.earned).length;
  const totalCount = achievements.length;

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  const groupedAchievements = filteredAchievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    },
    {} as Record<AchievementCategory, AchievementWithStatus[]>,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-950/50 text-red-400 rounded-lg">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header with progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Trophy Gallery</h1>
          <p className="text-zinc-400 mt-1">
            {earnedCount} of {totalCount} achievements unlocked
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full sm:w-64">
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <p className="text-sm text-zinc-500 text-right mt-1">
            {totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0}% complete
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${selectedCategory === "all" ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}
          `}
        >
          All
        </button>
        {(Object.keys(categoryConfig) as AchievementCategory[]).map((cat) => {
          const config = categoryConfig[cat];
          const Icon = config.icon;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                ${selectedCategory === cat ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}
              `}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Achievements by category */}
      {selectedCategory === "all" ? (
        (Object.keys(categoryConfig) as AchievementCategory[]).map((category) => {
          const config = categoryConfig[category];
          const categoryAchievements = groupedAchievements[category] || [];
          if (categoryAchievements.length === 0) return null;

          const Icon = config.icon;

          return (
            <section key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800">
                  <Icon className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{config.label}</h2>
                  <p className="text-sm text-zinc-500">{config.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryAchievements
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((achievement) => (
                    <TrophyCard key={achievement._id} achievement={achievement} />
                  ))}
              </div>
            </section>
          );
        })
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAchievements
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((achievement) => (
              <TrophyCard key={achievement._id} achievement={achievement} />
            ))}
        </div>
      )}

      {achievements.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <p>No achievements available yet. Start learning to unlock trophies!</p>
        </div>
      )}
    </div>
  );
}

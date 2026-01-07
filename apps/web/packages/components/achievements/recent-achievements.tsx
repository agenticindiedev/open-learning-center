"use client";

import type { Achievement, AchievementWithStatus } from "@interfaces/achievement.interface";
import type { UserAchievement } from "@interfaces/user-achievement.interface";
import { AchievementService } from "@services/achievement.service";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TrophyCard } from "./trophy-card";

interface RecentAchievementsProps {
  limit?: number;
}

export function RecentAchievements({ limit = 3 }: RecentAchievementsProps) {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [recentEarned, setRecentEarned] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      AchievementService.getAllWithStatus({ signal: controller.signal }),
      AchievementService.getRecent(limit, { signal: controller.signal }),
      AchievementService.getAll({ signal: controller.signal }),
    ])
      .then(([withStatus, recent, all]) => {
        setAchievements(withStatus);
        setRecentEarned(recent);
        setAllAchievements(all);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [limit]);

  const earnedCount = achievements.filter((a) => a.earned).length;
  const totalCount = achievements.length;

  // Get recent earned achievements as AchievementWithStatus
  const recentAchievementsWithStatus = recentEarned
    .reduce<AchievementWithStatus[]>((acc, ua) => {
      const achievement = allAchievements.find((a) => a._id === ua.achievementId);
      if (achievement) {
        acc.push({
          ...achievement,
          earned: true,
          earnedAt: ua.earnedAt,
        });
      }
      return acc;
    }, []);

  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Silently fail for widget
  }

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="font-semibold text-white">Achievements</h3>
        </div>
        <Link
          href="/achievements"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-zinc-400">Progress</span>
          <span className="text-zinc-400">
            {earnedCount}/{totalCount}
          </span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Recent achievements */}
      {recentAchievementsWithStatus.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Recent</p>
          <div className="space-y-2">
            {recentAchievementsWithStatus.map((achievement) => (
              <TrophyCard key={achievement._id} achievement={achievement} compact />
            ))}
          </div>
        </div>
      ) : earnedCount === 0 ? (
        <div className="text-center py-4 text-zinc-500 text-sm">
          <p>Complete lessons to earn trophies!</p>
        </div>
      ) : (
        <div className="text-sm text-zinc-500">
          <p>You&apos;ve earned {earnedCount} {earnedCount === 1 ? "trophy" : "trophies"}!</p>
        </div>
      )}
    </div>
  );
}

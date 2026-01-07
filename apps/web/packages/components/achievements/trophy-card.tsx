"use client";

import type { AchievementRarity, AchievementWithStatus } from "@interfaces/achievement.interface";
import {
  BookOpen,
  Boxes,
  Crown,
  Flame,
  GraduationCap,
  Hammer,
  type LucideIcon,
  MessageCircle,
  MessagesSquare,
  Package,
  Rocket,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  rocket: Rocket,
  zap: Zap,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  crown: Crown,
  package: Package,
  hammer: Hammer,
  boxes: Boxes,
  trophy: Trophy,
  "message-circle": MessageCircle,
  "messages-square": MessagesSquare,
  users: Users,
  flame: Flame,
  fire: Flame,
  star: Star,
};

const rarityConfig: Record<
  AchievementRarity,
  {
    bgClass: string;
    borderClass: string;
    glowClass: string;
    iconColor: string;
    label: string;
  }
> = {
  common: {
    bgClass: "bg-zinc-800/50",
    borderClass: "border-zinc-600",
    glowClass: "",
    iconColor: "text-zinc-400",
    label: "Common",
  },
  rare: {
    bgClass: "bg-blue-950/30",
    borderClass: "border-blue-500/50",
    glowClass: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    iconColor: "text-blue-400",
    label: "Rare",
  },
  epic: {
    bgClass: "bg-purple-950/30",
    borderClass: "border-purple-500/50",
    glowClass: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    iconColor: "text-purple-400",
    label: "Epic",
  },
  legendary: {
    bgClass: "bg-amber-950/30",
    borderClass: "border-amber-500/50",
    glowClass: "shadow-[0_0_25px_rgba(245,158,11,0.5)]",
    iconColor: "text-amber-400",
    label: "Legendary",
  },
};

interface TrophyCardProps {
  achievement: AchievementWithStatus;
  compact?: boolean;
}

export function TrophyCard({ achievement, compact = false }: TrophyCardProps) {
  const IconComponent = iconMap[achievement.icon] || Trophy;
  const config = rarityConfig[achievement.rarity];
  const isLocked = !achievement.earned;

  if (compact) {
    return (
      <div
        className={`
          relative p-3 rounded-xl border transition-all duration-300
          ${isLocked ? "bg-zinc-900/50 border-zinc-700/50 opacity-50" : `${config.bgClass} ${config.borderClass} ${config.glowClass}`}
          ${!isLocked && "hover:scale-105"}
        `}
        title={achievement.description}
      >
        <div className="flex items-center gap-2">
          <div
            className={`
              p-2 rounded-lg
              ${isLocked ? "bg-zinc-800" : "bg-black/30"}
            `}
          >
            {isLocked ? (
              <div className="w-5 h-5 text-zinc-600">?</div>
            ) : (
              <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
            )}
          </div>
          <span className={`text-sm font-medium ${isLocked ? "text-zinc-500" : "text-white"}`}>
            {isLocked ? "???" : achievement.title}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative p-4 rounded-2xl border transition-all duration-300
        ${isLocked ? "bg-zinc-900/50 border-zinc-700/50" : `${config.bgClass} ${config.borderClass} ${config.glowClass}`}
        ${!isLocked && "hover:scale-[1.02]"}
      `}
    >
      {/* Rarity badge */}
      {!isLocked && (
        <div className="absolute top-2 right-2">
          <span
            className={`
              text-xs px-2 py-0.5 rounded-full font-medium
              ${achievement.rarity === "common" && "bg-zinc-700 text-zinc-300"}
              ${achievement.rarity === "rare" && "bg-blue-500/20 text-blue-400"}
              ${achievement.rarity === "epic" && "bg-purple-500/20 text-purple-400"}
              ${achievement.rarity === "legendary" && "bg-amber-500/20 text-amber-400"}
            `}
          >
            {config.label}
          </span>
        </div>
      )}

      <div className="flex flex-col items-center text-center gap-3">
        {/* Icon container */}
        <div
          className={`
            relative p-4 rounded-xl
            ${isLocked ? "bg-zinc-800" : "bg-black/30"}
          `}
        >
          {isLocked ? (
            <div className="w-8 h-8 flex items-center justify-center text-zinc-600 text-2xl font-bold">
              ?
            </div>
          ) : (
            <>
              <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
              {achievement.rarity === "legendary" && (
                <div className="absolute inset-0 rounded-xl animate-pulse bg-amber-400/10" />
              )}
            </>
          )}
        </div>

        {/* Title */}
        <h3
          className={`
            font-semibold
            ${isLocked ? "text-zinc-500" : "text-white"}
          `}
        >
          {isLocked ? "???" : achievement.title}
        </h3>

        {/* Description */}
        <p
          className={`
            text-sm
            ${isLocked ? "text-zinc-600" : "text-zinc-400"}
          `}
        >
          {achievement.description}
        </p>

        {/* Earned date */}
        {achievement.earned && achievement.earnedAt && (
          <p className="text-xs text-zinc-500 mt-1">
            Earned {new Date(achievement.earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

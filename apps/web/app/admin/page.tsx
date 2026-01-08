"use client";

import { Card, CardContent } from "@shipshitdev/ui";
import { BookOpen, Calendar, GraduationCap, type LucideIcon, Users } from "lucide-react";
import Link from "next/link";

const ADMIN_LINKS: {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: "violet" | "amber" | "emerald" | "sky";
}[] = [
  {
    href: "/admin/communities",
    label: "Communities",
    description: "Create and manage learning communities",
    icon: Users,
    color: "violet",
  },
  {
    href: "/admin/courses",
    label: "Courses",
    description: "Build and organize course content",
    icon: GraduationCap,
    color: "amber",
  },
  {
    href: "/admin/lessons",
    label: "Lessons",
    description: "Write and edit individual lessons",
    icon: BookOpen,
    color: "emerald",
  },
  {
    href: "/admin/events",
    label: "Events",
    description: "Schedule and manage live events",
    icon: Calendar,
    color: "sky",
  },
];

const colorClasses = {
  violet: {
    bg: "bg-violet-600/20",
    text: "text-violet-400",
    border: "group-hover:border-violet-500/30",
    shadow: "group-hover:shadow-violet-600/10",
  },
  amber: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "group-hover:border-amber-500/30",
    shadow: "group-hover:shadow-amber-500/10",
  },
  emerald: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "group-hover:border-emerald-500/30",
    shadow: "group-hover:shadow-emerald-500/10",
  },
  sky: {
    bg: "bg-sky-500/20",
    text: "text-sky-400",
    border: "group-hover:border-sky-500/30",
    shadow: "group-hover:shadow-sky-500/10",
  },
};

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your communities, courses, lessons, and events.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {ADMIN_LINKS.map((link) => {
          const colors = colorClasses[link.color];
          return (
            <Link key={link.href} href={link.href}>
              <Card
                variant="outline"
                hover
                className={`group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${colors.shadow} ${colors.border}`}
              >
                <CardContent className="flex items-start gap-5 p-6">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${colors.bg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <link.icon
                      className={`h-7 w-7 ${colors.text} transition-transform duration-300 group-hover:rotate-6`}
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                      {link.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

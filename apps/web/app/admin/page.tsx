import Link from "next/link";
import { Card, CardContent } from "@agenticindiedev/ui";

const ADMIN_LINKS = [
  { href: "/admin/communities", label: "Communities", icon: "👥" },
  { href: "/admin/courses", label: "Courses", icon: "📚" },
  { href: "/admin/lessons", label: "Lessons", icon: "📝" },
  { href: "/admin/events", label: "Events", icon: "📅" },
];

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin</h1>
          <p className="mt-2 text-muted-foreground">Manage communities, courses, and lessons.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {ADMIN_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card variant="outline" hover className="group">
                <CardContent className="flex items-center gap-4 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl transition-all group-hover:bg-primary/20">
                    {link.icon}
                  </span>
                  <span className="font-semibold text-foreground">{link.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

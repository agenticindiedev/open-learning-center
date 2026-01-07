import { ArrowRight, Check, MessageCircle } from "lucide-react";
import Link from "next/link";

const DISCORD_INVITE_URL = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/your-invite";

export default function BillingSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/20">
          <Check className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-3xl font-bold text-foreground">Welcome to the community!</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your subscription is active. You now have full access to everything.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Join our private Discord</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Connect with other members, get help, and join live discussions.
              </p>
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4752c4]"
              >
                Join Discord Server
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/communities"
            className="flex-1 rounded-lg bg-primary px-6 py-3 text-center font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Explore Courses
          </Link>
          <Link
            href="/events"
            className="flex-1 rounded-lg border border-border bg-background px-6 py-3 text-center font-medium text-foreground transition-colors hover:bg-muted"
          >
            View Events
          </Link>
        </div>
      </div>
    </div>
  );
}

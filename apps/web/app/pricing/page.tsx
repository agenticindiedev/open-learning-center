"use client";

import { useAuth } from "@clerk/nextjs";
import { PricingCard, INCLUDED_FEATURES } from "@components/pricing";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Code,
  Megaphone,
  MessageCircle,
  ShoppingBag,
  Users,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";

const PATHS = [
  {
    icon: Code,
    title: "Build",
    subtitle: "Vibe Coding",
    description:
      "Learn to vibe code. Ship real apps with AI as your pair programmer. No experience needed.",
    color: "bg-violet-600/50",
    step: "Step 1",
  },
  {
    icon: ShoppingBag,
    title: "Sell",
    subtitle: "Ecommerce",
    description:
      "Launch and scale ecommerce stores. Learn to sell products online with AI-powered marketing.",
    color: "bg-amber-500/40",
    step: "Step 2",
  },
  {
    icon: Megaphone,
    title: "Distribute",
    subtitle: "AI Content",
    description:
      "Generate AI content and publish on socials. Build your audience and grow your reach.",
    color: "bg-emerald-500/40",
    step: "Step 3",
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "All Courses & Lessons",
    description: "Full access to every course, module, and lesson in the library.",
  },
  {
    icon: Users,
    title: "Private Discord Community",
    description: "Connect with builders, get feedback, and find accountability partners.",
  },
  {
    icon: Calendar,
    title: "Live Events & Workshops",
    description: "Weekly live sessions, Q&As, and hands-on workshops.",
  },
  {
    icon: Video,
    title: "1-on-1 Coaching Calls",
    description: "Book personal coaching sessions to get unstuck fast.",
  },
  {
    icon: MessageCircle,
    title: "Lesson Comments & Discussion",
    description: "Ask questions and discuss with other members on every lesson.",
  },
  {
    icon: Zap,
    title: "New Content Monthly",
    description: "Fresh courses, updates, and resources added every month.",
  },
];

export default function PricingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-accent/10 blur-[80px]" />
        </div>

        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">One membership.</span>
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-foreground">Everything included</span>
              <span
                className="absolute -bottom-1 left-0 h-4 w-full -skew-x-12 bg-violet-600/50"
                aria-hidden="true"
              />
            </span>
            <span className="text-primary">.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Get full access to all courses, community features, live events, and coaching. No tiers.
            No upsells. Just everything you need to build.
          </p>
        </div>
      </section>

      {/* The Journey Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              <span className="relative inline-block">
                <span className="relative z-10">Your journey</span>
                <span
                  className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-violet-600/50"
                  aria-hidden="true"
                />
              </span>{" "}
              from zero to income
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              A clear path: first you build, then you sell, then you scale. Each step unlocks the
              next.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid gap-6 md:grid-cols-3">
              {PATHS.map((path, idx) => (
                <div
                  key={path.title}
                  className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${idx === 0 ? "bg-violet-600/20" : idx === 1 ? "bg-amber-500/20" : "bg-emerald-500/20"}`}
                    >
                      <path.icon
                        className={`h-7 w-7 ${idx === 0 ? "text-violet-400" : idx === 1 ? "text-amber-400" : "text-emerald-400"}`}
                      />
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${idx === 0 ? "text-violet-400" : idx === 1 ? "text-amber-400" : "text-emerald-400"}`}
                    >
                      {path.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    <span className="relative inline-block">
                      <span className="relative z-10">{path.title}</span>
                      <span
                        className={`absolute -bottom-0.5 left-0 h-2 w-full -skew-x-12 ${path.color} opacity-0 transition-opacity group-hover:opacity-100`}
                        aria-hidden="true"
                      />
                    </span>
                  </h3>
                  <p className="mt-1 text-sm font-medium text-muted-foreground/80">
                    {path.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {path.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-12">
        <div className="mx-auto max-w-xl px-6">
          <PricingCard variant="interactive" featureStyle="checklist" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything you get{" "}
              <span className="relative inline-block">
                <span className="relative z-10">with your membership</span>
                <span
                  className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-amber-500/40"
                  aria-hidden="true"
                />
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              No hidden fees. No extra charges. Full access to the entire platform.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Ready to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">start building</span>
              <span
                className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-violet-600/50"
                aria-hidden="true"
              />
            </span>
            ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join thousands of builders learning to automate, create, and ship with AI.
          </p>
          <div className="mt-10">
            <Link
              href={isSignedIn ? "/courses" : "/sign-up"}
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              {isSignedIn ? "Go to Your Courses" : "Get Started Now"}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

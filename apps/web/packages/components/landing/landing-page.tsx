"use client";

import { Badge, Card, CardContent, CardFooter, CardHeader, Skeleton } from "@agenticindiedev/ui";
import { useAuth } from "@clerk/nextjs";
import type { Community } from "@interfaces/community.interface";
import type { Membership } from "@interfaces/membership.interface";
import { CommunityService } from "@services/community.service";
import { MembershipService } from "@services/membership.service";
import { SubscriptionService } from "@services/subscription.service";
import { ArrowRight, Code, type LucideIcon, Palette, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function getCommunityIcon(title: string): LucideIcon {
  const lower = title.toLowerCase();
  if (lower.includes("commerce") || lower.includes("ecom")) {
    return ShoppingCart;
  }
  if (lower.includes("code") || lower.includes("dev")) {
    return Code;
  }
  return Palette;
}

function CommunityPlaceholderIcon({ title }: { title: string }) {
  const Icon = getCommunityIcon(title);
  return (
    <div className="flex h-full items-center justify-center">
      <Icon className="h-16 w-16 text-primary/30" />
    </div>
  );
}

const JOURNEY_STEPS = [
  {
    icon: Code,
    step: "Step 1",
    title: "Learn to Build",
    subtitle: "Vibe Coding",
    description:
      "Start here. Ship real apps using Claude, Cursor, and modern AI tools. All you need is ideas and prompts.",
    color: "violet",
  },
  {
    icon: ShoppingCart,
    step: "Step 2",
    title: "Learn to Sell",
    subtitle: "Ecommerce & Products",
    description:
      "Now monetize. Build automated stores, digital products, and AI-powered marketing campaigns that generate revenue.",
    color: "amber",
  },
  {
    icon: Palette,
    step: "Step 3",
    title: "Learn to Scale",
    subtitle: "AI Content Distribution",
    description:
      "Finally, grow. Create viral content, automate social media, and build distribution engines that compound.",
    color: "emerald",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Start with Building",
    description:
      "Begin with vibe coding. Ship your first app with AI. No experience needed.",
  },
  {
    number: "02",
    title: "Learn to Monetize",
    description:
      "Apply your skills to ecommerce. Launch products that generate real revenue.",
  },
  {
    number: "03",
    title: "Scale with Content",
    description: "Build your distribution engine. Create content that compounds and grows.",
  },
  {
    number: "04",
    title: "Combine & Repeat",
    description: "Stack the skills. Build apps, sell products, and distribute content. Rinse and repeat.",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />

        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Floating orbs */}
        <div className="animate-float-slow absolute -left-20 top-20 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="animate-float absolute -right-20 top-40 h-[350px] w-[350px] rounded-full bg-violet-500/15 blur-[90px]" />
        <div className="animate-pulse-glow absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />

        {/* Animated accent lines */}
        <div className="absolute left-0 top-1/4 h-px w-1/3 animate-pulse bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute right-0 top-2/3 h-px w-1/4 animate-pulse bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" style={{ animationDelay: '1s' }} />

        {/* Corner accents */}
        <div className="absolute left-0 top-0 h-32 w-32 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="absolute bottom-0 right-0 h-32 w-32 bg-gradient-to-tl from-primary/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="animate-fade-in-up text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Build profitable businesses{" "}
          <span
            className="bg-gradient-to-r from-primary via-violet-400 to-primary"
            style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
          >
            with AI
          </span>
        </h1>

        <p className="animate-fade-in-up delay-100 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Learn to build e-commerce stores, ship AI-powered apps, and create content that
          scales. No coding experience required. Join a community of builders shipping real projects.
        </p>

        <div className="animate-fade-in-up delay-200 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
          >
            Start Learning Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#communities"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-base font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted"
          >
            Explore Communities
          </Link>
        </div>

        <div className="animate-fade-in-up delay-300 mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <svg
              className="h-5 w-5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Free tier available
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <svg
              className="h-5 w-5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Hands-on projects
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <svg
              className="h-5 w-5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Community support
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const colorClasses = {
    violet: {
      bg: "bg-violet-600/20",
      text: "text-violet-400",
      highlight: "bg-violet-600/50",
      shadow: "hover:shadow-violet-600/10",
    },
    amber: {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      highlight: "bg-amber-500/40",
      shadow: "hover:shadow-amber-500/10",
    },
    emerald: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      highlight: "bg-emerald-500/40",
      shadow: "hover:shadow-emerald-500/10",
    },
  };

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="relative inline-block">
              <span className="relative z-10">Your journey</span>
              <span className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-violet-600/50" aria-hidden="true" />
            </span>{" "}
            from zero to income
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A clear path: first you build, then you sell, then you scale. Each step unlocks the next.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting line above the cards */}
          <div className="absolute left-1/2 -top-4 hidden h-0.5 w-[60%] -translate-x-1/2 bg-gradient-to-r from-violet-600/30 via-amber-500/30 to-emerald-500/30 md:block" aria-hidden="true" />

          <div className="grid gap-8 md:grid-cols-3">
            {JOURNEY_STEPS.map((step, idx) => {
              const colors = colorClasses[step.color as keyof typeof colorClasses];
              return (
                <Card
                  key={step.title}
                  variant="outline"
                  hover
                  className={`group relative transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${colors.shadow}`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} transition-transform duration-300 group-hover:scale-110`}>
                        <step.icon className={`h-7 w-7 ${colors.text} transition-transform duration-300 group-hover:rotate-6`} />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}>
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      <span className="relative inline-block">
                        <span className="relative z-10">{step.title}</span>
                        <span className={`absolute -bottom-0.5 left-0 h-2 w-full -skew-x-12 ${colors.highlight} opacity-0 transition-all duration-300 group-hover:opacity-100`} aria-hidden="true" />
                      </span>
                    </h3>
                    <p className="mt-1 text-sm font-medium text-muted-foreground/80">{step.subtitle}</p>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="relative bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            The Path: Zero to Shipped
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A proven system to go from idea to launched project in weeks, not months.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="group relative transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="mb-4 font-mono text-5xl font-bold text-primary/20 transition-all duration-300 group-hover:text-primary/40 group-hover:scale-105">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CommunityCardProps {
  community: Community;
  isJoined: boolean;
  isSubscribed: boolean;
  onJoin: (id: string) => void;
  onSubscribe: () => void;
}

function CommunityCard({
  community,
  isJoined,
  isSubscribed,
  onJoin,
  onSubscribe,
}: CommunityCardProps) {
  const isFree = community.isFree;
  const price = community.priceMonthly || 49;

  return (
    <Card variant="outline" hover className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
      {/* Cover image placeholder */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {community.coverImageUrl ? (
          <Image
            src={community.coverImageUrl}
            alt={community.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <CommunityPlaceholderIcon title={community.title} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-80" />

        {/* Price badge */}
        <div className="absolute right-4 top-4 transition-transform duration-300 group-hover:scale-105">
          <Badge variant={isFree ? "success" : "secondary"}>
            {isFree ? "Free" : `$${price}/mo`}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <h3 className="text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">{community.title}</h3>
      </CardHeader>

      <CardContent className="flex-1">
        {community.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{community.description}</p>
        )}
      </CardContent>

      <CardFooter className="flex items-center gap-3">
        <Link
          href={`/communities/${community.slug}`}
          className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-center text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:border-primary/30"
        >
          View Community
        </Link>
        {isFree ? (
          <button
            type="button"
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isJoined
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
            }`}
            onClick={() => onJoin(community._id)}
            disabled={isJoined}
          >
            {isJoined ? "Joined" : "Join Free"}
          </button>
        ) : (
          <button
            type="button"
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isSubscribed
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
            }`}
            onClick={onSubscribe}
            disabled={isSubscribed}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </CardFooter>
    </Card>
  );
}

function CommunityCardSkeleton() {
  return (
    <Card variant="outline" className="flex flex-col overflow-hidden">
      <Skeleton className="h-48 rounded-none" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </CardFooter>
    </Card>
  );
}

function CommunitiesSection() {
  const { isSignedIn } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed] = useState(false);

  const joinedIds = new Set(memberships.map((m) => m.communityId));

  useEffect(() => {
    const controller = new AbortController();

    CommunityService.getAll({ signal: controller.signal })
      .then(setCommunities)
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      setMemberships([]);
      return;
    }

    MembershipService.getMine()
      .then(setMemberships)
      .catch(() => setMemberships([]));
  }, [isSignedIn]);

  const handleJoin = async (communityId: string) => {
    if (!isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }

    try {
      await MembershipService.join(communityId);
      const updated = await MembershipService.getMine();
      setMemberships(updated);
    } catch (err) {
      console.error("Failed to join:", err);
    }
  };

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }

    try {
      const { url } = await SubscriptionService.createCheckout();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Failed to subscribe:", err);
    }
  };

  return (
    <section id="communities" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Join a Community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Pick a track that matches your goals. Learn alongside other builders shipping real
            projects.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <CommunityCardSkeleton />
            <CommunityCardSkeleton />
            <CommunityCardSkeleton />
          </div>
        ) : error ? (
          <div className="mt-16 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-center text-destructive">
            {error}
          </div>
        ) : communities.length === 0 ? (
          <div className="mt-16 text-center text-muted-foreground">
            <p>No communities available yet.</p>
            <p className="mt-2 text-sm">Check back soon or contact us to get started.</p>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {communities.map((community) => (
              <CommunityCard
                key={community._id}
                community={community}
                isJoined={joinedIds.has(community._id)}
                isSubscribed={isSubscribed}
                onJoin={handleJoin}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative bg-muted/30 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent" />
      {/* Animated accent blobs */}
      <div className="animate-float-slow absolute -left-32 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
      <div className="animate-float absolute -right-32 top-1/2 h-[250px] w-[250px] -translate-y-1/2 rounded-full bg-accent/5 blur-[80px]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Ready to start building?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Join thousands of builders learning to automate, create, and ship with AI.
        </p>

        <div className="mt-10">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 Open Learning Center. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/communities" className="hover:text-foreground transition-colors">
              Communities
            </Link>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <StepsSection />
      <CommunitiesSection />
      <CtaSection />
      <Footer />
    </div>
  );
}

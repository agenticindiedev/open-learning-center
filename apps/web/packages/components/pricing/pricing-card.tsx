"use client";

import { useAuth } from "@clerk/nextjs";
import { SubscriptionService } from "@services/subscription.service";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Loader2,
  MessageCircle,
  Users,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ============================================================================
// SHARED DATA
// ============================================================================

export const PRICING_AMOUNT = 49;

export const PRICING_FEATURES = [
  { icon: BookOpen, text: "All courses & lessons" },
  { icon: Users, text: "Private Discord community" },
  { icon: Calendar, text: "Weekly live workshops" },
  { icon: Video, text: "1-on-1 coaching calls" },
  { icon: MessageCircle, text: "Lesson comments & discussion" },
  { icon: Zap, text: "New content monthly" },
];

export const INCLUDED_FEATURES = [
  "Full access to all courses",
  "Private Discord community",
  "Live events & workshops",
  "1-on-1 coaching calls",
  "Lesson comments & discussion",
  "New content monthly",
  "Cancel anytime",
];

// ============================================================================
// TYPES
// ============================================================================

interface PricingCardProps {
  /**
   * "preview" - Static card that links to sign-up (for landing page)
   * "interactive" - Full Stripe integration (for pricing page)
   */
  variant?: "preview" | "interactive";
  /**
   * Display style for features
   * "icons" - Shows features with icons in 2-column grid
   * "checklist" - Shows features as simple checklist
   */
  featureStyle?: "icons" | "checklist";
  /**
   * Optional className for the container
   */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function PricingCard({
  variant = "preview",
  featureStyle = "icons",
  className = "",
}: PricingCardProps) {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(variant === "interactive");
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Only check subscription status for interactive variant
  useEffect(() => {
    if (variant !== "interactive") return;

    if (!isSignedIn) {
      setIsCheckingStatus(false);
      setHasActiveSubscription(false);
      return;
    }

    SubscriptionService.getMine()
      .then((subscriptions) => {
        const activeSub = subscriptions.find((sub) => sub.status === "active");
        setHasActiveSubscription(!!activeSub);
        if (activeSub?.currentPeriodEnd) {
          setSubscriptionEnd(new Date(activeSub.currentPeriodEnd).toLocaleDateString());
        }
      })
      .catch(() => setHasActiveSubscription(false))
      .finally(() => setIsCheckingStatus(false));
  }, [isSignedIn, variant]);

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      window.location.href = "/sign-up";
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { url } = await SubscriptionService.createCheckout();
      if (url) {
        window.location.href = url;
      } else {
        setError("Failed to create checkout session. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { url } = await SubscriptionService.createPortalSession();
      if (url) {
        window.location.href = url;
      } else {
        setError("Failed to open billing portal. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl ${className}`}
    >
      {/* Badge */}
      <div className="absolute right-6 top-6">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
          {variant === "interactive" ? "Most Popular" : "Full Access"}
        </span>
      </div>

      <div className="p-8 pt-12">
        {/* Title - only show on interactive variant */}
        {variant === "interactive" && (
          <>
            <h3 className="text-2xl font-bold text-foreground">Full Access Membership</h3>
            <p className="mt-2 text-muted-foreground">
              Everything you need to build, sell, and scale with AI.
            </p>
          </>
        )}

        {/* Price */}
        <div
          className={`flex items-baseline gap-2 ${variant === "interactive" ? "mt-6" : "justify-center"}`}
        >
          <span className="text-5xl font-bold tracking-tight text-foreground">
            ${PRICING_AMOUNT}
          </span>
          <span className="text-muted-foreground">/month</span>
        </div>

        {/* Subtitle for preview */}
        {variant === "preview" && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Less than $2/day to change your life
          </p>
        )}

        {/* Features */}
        {featureStyle === "icons" ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {PRICING_FEATURES.map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-3 text-sm text-foreground"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                {feature.text}
              </div>
            ))}
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {INCLUDED_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-8">
          {variant === "preview" ? (
            // Preview variant: Simple link to sign-up
            <Link
              href="/sign-up"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : isCheckingStatus ? (
            // Interactive variant: Loading state
            <div className="flex h-14 items-center justify-center rounded-xl bg-muted">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : hasActiveSubscription ? (
            // Interactive variant: Already subscribed
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center">
                <p className="font-medium text-emerald-600 dark:text-emerald-400">
                  You have an active subscription
                </p>
                {subscriptionEnd && (
                  <p className="mt-1 text-sm text-muted-foreground">Renews on {subscriptionEnd}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleManageSubscription}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-4 text-base font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Manage Subscription
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          ) : (
            // Interactive variant: Not subscribed
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isSignedIn ? "Subscribe Now" : "Get Started"}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Footer text */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {variant === "interactive"
            ? "Secure payment powered by Stripe. Cancel anytime."
            : "30-day money-back guarantee. Cancel anytime."}
        </p>
      </div>
    </div>
  );
}

"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { SubscriptionService } from "@services/subscription.service";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function Header() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // On landing page, show header only on scroll. On other pages, always show.
  const isLandingPage = pathname === "/";

  const handleScroll = useCallback(() => {
    if (!isLandingPage) {
      setIsVisible(true);
      return;
    }
    const scrollY = window.scrollY;
    setIsVisible(scrollY > 50);
  }, [isLandingPage]);

  useEffect(() => {
    // Immediately show header on non-landing pages
    if (!isLandingPage) {
      setIsVisible(true);
    } else {
      handleScroll();
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, isLandingPage]);

  useEffect(() => {
    if (!isSignedIn) {
      setHasActiveSubscription(false);
      return;
    }

    SubscriptionService.getMine()
      .then((subscriptions) => {
        const active = subscriptions.some((sub) => sub.status === "active");
        setHasActiveSubscription(active);
      })
      .catch(() => setHasActiveSubscription(false));
  }, [isSignedIn]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl transition-all duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            OL
          </span>
          Open Learning Center
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/communities"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Communities
          </Link>
          <Link
            href="/pricing"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/tools"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Tools
          </Link>
          {isSignedIn && hasActiveSubscription && (
            <Link
              href="/events"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Events
            </Link>
          )}
          {isSignedIn && hasActiveSubscription && (
            <Link
              href="/bookings"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Book 1-1
            </Link>
          )}
          <SignedIn>
            <Link
              href="/admin"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button
                type="button"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 transition-colors hover:bg-primary/90"
              >
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}

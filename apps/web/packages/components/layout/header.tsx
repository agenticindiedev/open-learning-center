"use client";

import {
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { SubscriptionService } from "@services/subscription.service";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const ADMIN_EMAIL = "vincent@genfeed.ai";

export function Header() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const isAdmin = user?.emailAddresses?.some((email) => email.emailAddress === ADMIN_EMAIL);
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
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
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
            href="/courses"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Courses
          </Link>
          <Link
            href="/events"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Events
          </Link>
          {!(isSignedIn && hasActiveSubscription) && (
            <Link
              href="/pricing"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          )}
          <Link
            href="/tools"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Tools
          </Link>
          <SignedIn>
            <Link
              href="/achievements"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Trophies
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Admin
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}

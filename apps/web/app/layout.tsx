import type { Metadata } from "next";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Open Learning Center",
  description: "Open Learning Center learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold">
                Open Learning Center
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/communities">Communities</Link>
                <Link href="/events">Events</Link>
                <Link href="/bookings">Book 1-1</Link>
                <SignedIn>
                  <Link href="/admin">Admin</Link>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton />
                  <SignUpButton />
                </SignedOut>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}

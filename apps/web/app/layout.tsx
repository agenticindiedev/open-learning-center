import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@components/layout/header";
import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Open Learning Center",
  description:
    "Learn to build profitable businesses with AI. E-commerce, indie dev, and content creation tracks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="bg-background font-sans text-foreground antialiased">
          <Header />
          <main className="pt-[73px]">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}

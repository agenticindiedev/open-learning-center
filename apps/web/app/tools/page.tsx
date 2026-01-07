"use client";

import {
  Bot,
  Code,
  CreditCard,
  ExternalLink,
  FileText,
  Globe,
  Image,
  Megaphone,
  MessageSquare,
  Palette,
  Play,
  Server,
  ShoppingCart,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface Tool {
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  tag?: string;
  tagColor?: string;
}

const TOOLS: Tool[] = [
  // AI Coding Tools
  {
    name: "Cursor",
    description: "AI-first code editor. Write code with Claude as your pair programmer.",
    category: "AI Coding",
    icon: Code,
    url: "https://cursor.com",
    tag: "Essential",
    tagColor: "bg-violet-500/20 text-violet-400",
  },
  {
    name: "Claude",
    description: "Anthropic's AI assistant. Best for coding, writing, and reasoning tasks.",
    category: "AI Coding",
    icon: Bot,
    url: "https://claude.ai",
    tag: "Essential",
    tagColor: "bg-violet-500/20 text-violet-400",
  },
  {
    name: "Vercel",
    description: "Deploy frontend apps instantly. Perfect for Next.js projects.",
    category: "AI Coding",
    icon: Globe,
    url: "https://vercel.com",
  },
  {
    name: "Railway",
    description: "Deploy backends, databases, and services with zero config.",
    category: "AI Coding",
    icon: Server,
    url: "https://railway.app",
  },
  {
    name: "v0",
    description: "Generate UI components with AI. Ship beautiful interfaces fast.",
    category: "AI Coding",
    icon: Palette,
    url: "https://v0.dev",
    tag: "New",
    tagColor: "bg-emerald-500/20 text-emerald-400",
  },

  // Ecommerce Tools
  {
    name: "Shopify",
    description: "Build and scale your online store. The industry standard for ecommerce.",
    category: "Ecommerce",
    icon: ShoppingCart,
    url: "https://shopify.com",
    tag: "Essential",
    tagColor: "bg-violet-500/20 text-violet-400",
  },
  {
    name: "Stripe",
    description: "Accept payments globally. APIs that developers love.",
    category: "Ecommerce",
    icon: CreditCard,
    url: "https://stripe.com",
    tag: "Essential",
    tagColor: "bg-violet-500/20 text-violet-400",
  },
  {
    name: "Gumroad",
    description: "Sell digital products, courses, and memberships with zero setup.",
    category: "Ecommerce",
    icon: Zap,
    url: "https://gumroad.com",
  },
  {
    name: "Lemon Squeezy",
    description: "All-in-one platform for selling digital products. Built for developers.",
    category: "Ecommerce",
    icon: Sparkles,
    url: "https://lemonsqueezy.com",
  },

  // Content Creation Tools
  {
    name: "Midjourney",
    description: "Generate stunning AI images. Perfect for thumbnails and graphics.",
    category: "Content",
    icon: Image,
    url: "https://midjourney.com",
    tag: "Popular",
    tagColor: "bg-amber-500/20 text-amber-400",
  },
  {
    name: "ElevenLabs",
    description: "AI voice generation. Create realistic voiceovers for videos.",
    category: "Content",
    icon: Play,
    url: "https://elevenlabs.io",
    tag: "Popular",
    tagColor: "bg-amber-500/20 text-amber-400",
  },
  {
    name: "Runway",
    description: "AI video generation and editing. Create stunning video content.",
    category: "Content",
    icon: Video,
    url: "https://runwayml.com",
  },
  {
    name: "Descript",
    description: "Edit video and audio by editing text. Podcast and video production made easy.",
    category: "Content",
    icon: FileText,
    url: "https://descript.com",
  },
  {
    name: "Canva",
    description: "Design graphics, social posts, and presentations. No design skills needed.",
    category: "Content",
    icon: Palette,
    url: "https://canva.com",
  },

  // Marketing & Distribution
  {
    name: "Beehiiv",
    description: "Newsletter platform built for growth. Monetize your audience.",
    category: "Marketing",
    icon: MessageSquare,
    url: "https://beehiiv.com",
    tag: "Recommended",
    tagColor: "bg-emerald-500/20 text-emerald-400",
  },
  {
    name: "Buffer",
    description: "Schedule and manage social media posts across all platforms.",
    category: "Marketing",
    icon: Megaphone,
    url: "https://buffer.com",
  },
  {
    name: "Typefully",
    description: "Write, schedule, and grow on Twitter/X. Thread composer and analytics.",
    category: "Marketing",
    icon: FileText,
    url: "https://typefully.com",
  },
];

const CATEGORIES = [
  { name: "AI Coding", icon: Code, color: "text-violet-400", bgColor: "bg-violet-500/10" },
  { name: "Ecommerce", icon: ShoppingCart, color: "text-amber-400", bgColor: "bg-amber-500/10" },
  { name: "Content", icon: Video, color: "text-rose-400", bgColor: "bg-rose-500/10" },
  { name: "Marketing", icon: Megaphone, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
];

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      {tool.tag && (
        <span className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${tool.tagColor}`}>
          {tool.tag}
        </span>
      )}

      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>

      <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        {tool.name}
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {tool.description}
      </p>
    </a>
  );
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[80px]" />
        </div>

        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">The tools we</span>
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-foreground">use and recommend</span>
              <span
                className="absolute -bottom-1 left-0 h-4 w-full -skew-x-12 bg-violet-600/50"
                aria-hidden="true"
              />
            </span>
            <span className="text-primary">.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            These are the exact tools we use in our courses and for our own businesses.
            Some links are affiliate links that help support the platform at no extra cost to you.
          </p>
        </div>
      </section>

      {/* Category Pills */}
      <section className="border-b border-border pb-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <a
                  key={category.name}
                  href={`#${category.name.toLowerCase().replace(" ", "-")}`}
                  className={`inline-flex items-center gap-2 rounded-full ${category.bgColor} px-4 py-2 text-sm font-medium ${category.color} transition-all hover:scale-105`}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools by Category */}
      {CATEGORIES.map((category) => {
        const categoryTools = TOOLS.filter((t) => t.category === category.name);
        const Icon = category.icon;

        return (
          <section
            key={category.name}
            id={category.name.toLowerCase().replace(" ", "-")}
            className="py-16"
          >
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-10 flex items-center gap-3">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${category.bgColor}`}>
                  <Icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{category.name}</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.name} tool={tool} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="border-t border-border py-20">
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
            Learn how to use these tools effectively in our courses. Build real projects and start earning.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              View Pricing
            </Link>
            <Link
              href="/communities"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-base font-medium text-foreground transition-all hover:border-primary/30"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

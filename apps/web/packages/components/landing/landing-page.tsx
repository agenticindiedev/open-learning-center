"use client";

import { Card, CardContent } from "@agenticindiedev/ui";
import { PRICING_AMOUNT, PricingCard } from "@components/pricing";
import {
  ArrowRight,
  Briefcase,
  Check,
  ChevronDown,
  Code,
  Lightbulb,
  Palette,
  Play,
  Rocket,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ============================================================================
// DATA
// ============================================================================

const JOURNEY_STEPS = [
  {
    icon: Code,
    step: "Step 1",
    title: "Vibe Code",
    subtitle: "Build with AI",
    description:
      "Learn to vibe code. Ship real apps with AI as your pair programmer. No experience needed.",
    color: "violet",
    href: "/courses/vibe-coder-core",
  },
  {
    icon: ShoppingCart,
    step: "Step 2",
    title: "Ecom Sell",
    subtitle: "Launch & Scale",
    description:
      "Launch and scale ecommerce stores. Learn to sell products online with AI-powered marketing.",
    color: "amber",
    href: "/courses/ecom-builder-core",
  },
  {
    icon: Palette,
    step: "Step 3",
    title: "Content Creation",
    subtitle: "Grow Your Reach",
    description:
      "Generate AI content and publish on socials. Build your audience and grow your reach.",
    color: "emerald",
    href: "/courses/content-creation-core",
  },
];

const STATS = [
  { value: "1,000+", label: "Builders learning" },
  { value: "50+", label: "Video lessons" },
  { value: "Weekly", label: "Live workshops" },
  { value: "24/7", label: "Community access" },
];

const PAIN_POINTS = [
  {
    icon: Play,
    title: "Tutorial purgatory",
    description: "Watching endless videos but never shipping anything real",
  },
  {
    icon: Lightbulb,
    title: "Ideas stuck in your head",
    description: "Great business ideas that never make it past the thinking stage",
  },
  {
    icon: Code,
    title: "The technical barrier",
    description: "Feeling blocked because you don't know how to code",
  },
  {
    icon: Target,
    title: "No clear path",
    description: "Learning random skills with no roadmap from learning to earning",
  },
];

const PERSONAS = [
  {
    icon: Briefcase,
    title: "Career Changers",
    description:
      "You're done with the 9-5 grind. You want to build something of your own and escape the corporate ladder.",
    forYou: [
      "Want location independence",
      "Ready for a career pivot",
      "Have savings to invest in yourself",
    ],
  },
  {
    icon: Rocket,
    title: "Side Hustlers",
    description:
      "You have a day job but want to build income streams on the side. You're ready to put in the work after hours.",
    forYou: ["Have 5-10 hours weekly", "Want extra income", "Looking for a path to full-time"],
  },
  {
    icon: Sparkles,
    title: "Creators & Makers",
    description:
      "You already create content or have a following. You want to monetize your audience and build real products.",
    forYou: ["Have existing audience", "Want to diversify income", "Ready to build products"],
  },
];

const NOT_FOR = [
  "Looking for get-rich-quick schemes",
  "Not willing to put in the work",
  "Expecting overnight success",
];

const OUTCOMES = [
  {
    icon: Code,
    title: "Ship a SaaS MVP",
    description: "Build and launch a working software product in 2 weeks",
    timeframe: "2 weeks",
  },
  {
    icon: ShoppingCart,
    title: "Launch an ecom store",
    description: "Set up a Shopify store with AI-generated product descriptions",
    timeframe: "1 week",
  },
  {
    icon: Palette,
    title: "Create 30 days of content",
    description: "Generate a month of social media content in one afternoon",
    timeframe: "1 afternoon",
  },
  {
    icon: TrendingUp,
    title: "Build your audience",
    description: "Grow your following with consistent, quality content",
    timeframe: "Ongoing",
  },
];

const TESTIMONIALS = [
  {
    name: "Alex Chen",
    role: "Former Product Manager",
    avatar: "AC",
    quote:
      "I went from zero coding experience to shipping my first SaaS in 3 weeks. The vibe coding approach just clicked for me.",
    result: "Launched MVP in 3 weeks",
  },
  {
    name: "Sarah Mitchell",
    role: "Content Creator",
    avatar: "SM",
    quote:
      "The AI content creation workflows saved me 20+ hours a week. Now I can focus on what I love while the content keeps flowing.",
    result: "20+ hours saved weekly",
  },
  {
    name: "Marcus Johnson",
    role: "Side Hustler",
    avatar: "MJ",
    quote:
      "Started as a side project while working my day job. Six months later, my store is doing $5k/month and I'm planning my exit.",
    result: "$5k/month in 6 months",
  },
];

const FAQS = [
  {
    question: "Do I need coding experience?",
    answer:
      "No! The vibe coding approach is specifically designed for non-coders. You'll learn to work with AI tools that handle the technical complexity while you focus on building your vision.",
  },
  {
    question: "How much time do I need per week?",
    answer:
      "We recommend 5-10 hours per week to make solid progress. The courses are self-paced, so you can go faster or slower depending on your schedule. Many members see results within their first month.",
  },
  {
    question: "What if I get stuck?",
    answer:
      "You're never alone. Our private Discord community is active 24/7 with fellow builders and mentors. We also have weekly live workshops where you can ask questions directly and get personalized help.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes! We offer a 30-day money-back guarantee. If the program isn't right for you, just reach out within 30 days and we'll refund your payment, no questions asked.",
  },
  {
    question: "How is this different from YouTube tutorials?",
    answer:
      "YouTube teaches isolated skills. We teach complete systems - from idea to income. You get structured paths, real projects, community support, live coaching, and accountability. It's the difference between random learning and a proven roadmap.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. There are no contracts or commitments. Cancel with one click from your account settings. Your access continues until the end of your billing period.",
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="animate-float-slow absolute -left-20 top-20 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="animate-float absolute -right-20 top-40 h-[350px] w-[350px] rounded-full bg-violet-500/15 blur-[90px]" />
        <div className="animate-pulse-glow absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute left-0 top-1/4 h-px w-1/3 animate-pulse bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div
          className="absolute right-0 top-2/3 h-px w-1/4 animate-pulse bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute left-0 top-0 h-32 w-32 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="absolute bottom-0 right-0 h-32 w-32 bg-gradient-to-tl from-primary/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
          <Users className="h-4 w-4" />
          Join 1,000+ builders already learning
        </div>

        <h1 className="animate-fade-in-up text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Build profitable businesses{" "}
          <span
            className="bg-gradient-to-r from-primary via-violet-400 to-primary"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            with AI
          </span>
        </h1>

        <p className="animate-fade-in-up delay-100 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Go from zero to shipping apps, selling products, and growing audiences - all with AI as
          your co-pilot. No coding experience required.
        </p>

        <div className="animate-fade-in-up delay-200 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
          >
            Start Learning Now
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-base font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted"
          >
            Browse Free Lessons
          </Link>
        </div>

        <div className="animate-fade-in-up delay-300 mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <Check className="h-5 w-5 text-primary" />
            Self-paced learning
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <Check className="h-5 w-5 text-primary" />
            Hands-on projects
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <Check className="h-5 w-5 text-primary" />
            30-day money-back guarantee
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProofBar() {
  return (
    <section className="border-y border-border bg-muted/30 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Tired of building{" "}
            <span className="relative inline-block">
              <span className="relative z-10">someone else's dream?</span>
              <span
                className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-destructive/30"
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The AI revolution is here. People are quitting their jobs and launching businesses from
            their laptops. The only question is:{" "}
            <span className="font-semibold text-foreground">are you in or out?</span>
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PAIN_POINTS.map((point) => (
            <div
              key={point.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-destructive/30 hover:bg-destructive/5"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <point.icon className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoIsThisForSection() {
  return (
    <section className="relative bg-muted/20 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="relative inline-block">
              <span className="relative z-10">Who this is for</span>
              <span
                className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-primary/30"
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            This program is designed for action-takers who are ready to build something real.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PERSONAS.map((persona) => (
            <Card
              key={persona.title}
              variant="outline"
              hover
              className="group transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <persona.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{persona.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {persona.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {persona.forYou.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground">This is NOT for you if...</h3>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            {NOT_FOR.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OutcomesSection() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="relative inline-block">
              <span className="relative z-10">What you'll build</span>
              <span
                className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-emerald-500/40"
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Real projects, real results. Here's what members ship in their first month.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {OUTCOMES.map((outcome) => (
            <div
              key={outcome.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <outcome.icon className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="mb-2 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                {outcome.timeframe}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{outcome.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {outcome.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PathSection() {
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
    <section className="relative bg-muted/20 py-24">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="relative inline-block">
              <span className="relative z-10">Your Learning</span>
              <span
                className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-violet-600/50"
                aria-hidden="true"
              />
            </span>{" "}
            Path
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Three tracks to master: vibe coding, e-commerce, and content creation. Each step unlocks
            the next.
          </p>
        </div>

        <div className="mt-16">
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
                      <div
                        className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <step.icon
                          className={`h-7 w-7 ${colors.text} transition-transform duration-300 group-hover:rotate-6`}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}
                      >
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      <span className="relative inline-block">
                        <span className="relative z-10">{step.title}</span>
                        <span
                          className={`absolute -bottom-0.5 left-0 h-2 w-full -skew-x-12 ${colors.highlight} opacity-0 transition-all duration-300 group-hover:opacity-100`}
                          aria-hidden="true"
                        />
                      </span>
                    </h3>
                    <p className="mt-1 text-sm font-medium text-muted-foreground/80">
                      {step.subtitle}
                    </p>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{step.description}</p>
                    <Link
                      href={step.href}
                      className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${colors.text} hover:underline`}
                    >
                      Start learning
                      <ArrowRight className="h-4 w-4" />
                    </Link>
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

function TestimonialsSection() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="relative inline-block">
              <span className="relative z-10">What builders are saying</span>
              <span
                className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-amber-500/40"
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Real results from real members. These could be you.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <Card
              key={testimonial.name}
              variant="outline"
              className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">"{testimonial.quote}"</p>
                <div className="mt-4 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500">
                  {testimonial.result}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative bg-muted/20 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="relative inline-block">
              <span className="relative z-10">Common questions</span>
              <span
                className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-violet-600/50"
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to know before joining.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={faq.question}
              className="rounded-xl border border-border bg-card overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === idx ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-4 text-muted-foreground leading-relaxed">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPreviewSection() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="relative inline-block">
              <span className="relative z-10">Simple, transparent pricing</span>
              <span
                className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-primary/30"
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            One membership. Everything included. No hidden fees.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <PricingCard variant="preview" featureStyle="icons" />
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="relative bg-muted/30 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent" />
      <div className="animate-float-slow absolute -left-32 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
      <div className="animate-float absolute -right-32 top-1/2 h-[250px] w-[250px] -translate-y-1/2 rounded-full bg-accent/5 blur-[80px]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
          Start today, ship your first project{" "}
          <span className="relative inline-block">
            <span className="relative z-10">this week</span>
            <span
              className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-primary/40"
              aria-hidden="true"
            />
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Join 1,000+ builders learning to automate, create, and ship with AI. Your transformation
          starts with one click.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
          >
            Join Now - ${PRICING_AMOUNT}/month
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-sm text-muted-foreground">
            30-day money-back guarantee. No risk, no questions asked.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Instant access
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Cancel anytime
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Money-back guarantee
          </div>
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
            <Link href="/courses" className="hover:text-foreground transition-colors">
              Courses
            </Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <SocialProofBar />
      <ProblemSection />
      <WhoIsThisForSection />
      <OutcomesSection />
      <PathSection />
      <TestimonialsSection />
      <FaqSection />
      <PricingPreviewSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}

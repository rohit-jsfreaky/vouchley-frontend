/**
 * Authoritative pricing — one-time credit packs, credits never expire.
 * Source of truth: pricing.md at repo root.
 */

export type PackSlug = "free" | "starter" | "pro" | "scale";

export interface PricingPlan {
  slug: PackSlug;
  name: string;
  price: string;
  priceSuffix: string;
  description: string;
  credits: string;
  creditsNote: string;
  cta: {
    label: string;
    href: string;
    variant: "primary" | "secondary";
  };
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    slug: "free",
    name: "Free",
    price: "$0",
    priceSuffix: "on signup",
    description: "Perfect for side projects and testing the API.",
    credits: "100 credits",
    creditsNote: "Never expire",
    cta: { label: "Get Started", href: "/signup", variant: "secondary" },
    features: [
      "Core verification API",
      "30-day result caching",
      "Cache hits are always free",
      "Community support",
    ],
  },
  {
    slug: "starter",
    name: "Starter",
    price: "$29",
    priceSuffix: "one-time",
    description: "For solo founders and MVP validation.",
    credits: "3,000 credits",
    creditsNote: "Never expire",
    cta: { label: "Choose Starter", href: "/signup?pack=starter", variant: "secondary" },
    features: [
      "Everything in Free",
      "Email support",
      "$0.0097 per credit",
      "Stack multiple packs",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    price: "$99",
    priceSuffix: "one-time",
    description: "For growing SaaS at $1–20k MRR.",
    credits: "12,000 credits",
    creditsNote: "Never expire",
    cta: { label: "Choose Pro", href: "/signup?pack=pro", variant: "primary" },
    features: [
      "Everything in Starter",
      "Priority email support",
      "Auto-refill available at $89/mo",
      "$0.00825 per credit — save 15%",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    slug: "scale",
    name: "Scale",
    price: "$299",
    priceSuffix: "one-time",
    description: "For established products with real volume.",
    credits: "40,000 credits",
    creditsNote: "Never expire",
    cta: { label: "Choose Scale", href: "/signup?pack=scale", variant: "secondary" },
    features: [
      "Everything in Pro",
      "Slack shared channel",
      "$0.00748 per credit — best rate",
      "Custom allow/block lists",
    ],
  },
];

export const PRICING_HEADER = {
  eyebrow: "Pricing",
  title: "Simple, usage-based pricing.",
  subtitle:
    "Buy credits once. They never expire. Pay only for what you verify — cache hits are always free.",
} as const;

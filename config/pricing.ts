/**
 * Authoritative pricing — monthly credit plans; unused credits roll over and
 * never expire. Source of truth: pricing.md at repo root.
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
    price: "$19",
    priceSuffix: "per month",
    description: "For solo founders and MVP validation.",
    credits: "15,000 credits",
    creditsNote: "Roll over monthly",
    cta: { label: "Choose Starter", href: "/signup?pack=starter", variant: "secondary" },
    features: [
      "Everything in Free",
      "Email support",
      "$0.00127 per credit",
      "Credits roll over & never expire",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    price: "$49",
    priceSuffix: "per month",
    description: "For growing SaaS at $1–20k MRR.",
    credits: "50,000 credits",
    creditsNote: "Roll over monthly",
    cta: { label: "Choose Pro", href: "/signup?pack=pro", variant: "primary" },
    features: [
      "Everything in Starter",
      "Priority email support",
      "Credits roll over every month",
      "$0.00098 per credit — save 23%",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    slug: "scale",
    name: "Scale",
    price: "$99",
    priceSuffix: "per month",
    description: "For established products with real volume.",
    credits: "200,000 credits",
    creditsNote: "Roll over monthly",
    cta: { label: "Choose Scale", href: "/signup?pack=scale", variant: "secondary" },
    features: [
      "Everything in Pro",
      "Slack shared channel",
      "$0.0005 per credit — best rate",
      "Custom allow/block lists",
    ],
  },
];

export const PRICING_HEADER = {
  eyebrow: "Pricing",
  title: "Simple, usage-based pricing.",
  subtitle:
    "Monthly credit plans. Unused credits roll over and never expire — pay only for what you verify, and cache hits are always free.",
} as const;

import { Check } from "lucide-react";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import type { PricingPlan } from "@/config/pricing";
import { cn } from "@/lib/utils";

export function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-xl bg-surface p-8 transition-all duration-200",
        plan.highlighted
          ? "border-2 border-brand shadow-[0_20px_50px_-12px_rgba(184,96,60,0.15)]"
          : "border border-border/30 shadow-[var(--shadow-soft)] hover:bg-canvas",
      )}
    >
      {plan.badge && (
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-inverse">
          {plan.badge}
        </span>
      )}

      <h3
        className={cn(
          "mb-2 font-serif text-2xl font-semibold",
          plan.highlighted ? "text-brand" : "text-ink",
        )}
      >
        {plan.name}
      </h3>
      <p className="mb-6 h-10 text-sm text-ink-muted">{plan.description}</p>

      <div className="mb-6">
        <span className="font-serif text-5xl font-bold text-ink">
          {plan.price}
        </span>
        <span className="ml-1 text-sm text-ink-muted">{plan.priceSuffix}</span>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-ink">{plan.credits}</p>
        <p className="text-xs text-ink-soft">{plan.creditsNote}</p>
      </div>

      <Link
        href={plan.cta.href}
        className={cn(
          buttonStyles({ variant: plan.cta.variant, size: "md" }),
          "mb-8 w-full",
        )}
      >
        {plan.cta.label}
      </Link>

      <ul className="flex-grow space-y-4 text-sm text-ink-muted">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check
              className="mt-0.5 size-4 shrink-0 text-brand"
              strokeWidth={2.5}
              aria-hidden
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

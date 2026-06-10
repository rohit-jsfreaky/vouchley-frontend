"use client";

import { BarChart3, DollarSign, ReceiptText } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsageSummary } from "@/lib/api-dashboard";
import { cn } from "@/lib/utils";

export function UsageSummaryTiles({
  data,
  loading,
}: {
  data: UsageSummary | null;
  loading: boolean;
}) {
  if (loading) return <UsageSummarySkeleton />;
  if (!data) return null;

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Tile
        label="Total Checks"
        value={data.total_checks.toLocaleString()}
        icon={BarChart3}
      />
      <Tile
        label="Billable Operations"
        value={data.billable_checks.toLocaleString()}
        caption={
          data.cached_checks > 0
            ? `Excludes ${data.cached_checks.toLocaleString()} cache hits`
            : "No cache hits this period"
        }
        highlight
        icon={ReceiptText}
      />
      <Tile
        label="Est. Cost"
        value={`$${data.estimated_cost_usd.toFixed(2)}`}
        caption={`${data.credits_used.toLocaleString()} credits used`}
        icon={DollarSign}
      />
    </section>
  );
}

function Tile({
  label,
  value,
  caption,
  highlight = false,
  icon: Icon,
}: {
  label: string;
  value: string;
  caption?: string;
  highlight?: boolean;
  icon: React.ElementType;
}) {
  return (
    <Card
      className={cn(
        "relative gap-3 overflow-hidden border-border/20 px-6 py-6 shadow-[var(--shadow-soft)]",
        highlight && "ring-1 ring-brand-soft",
      )}
    >
      <Icon
        className="absolute right-4 top-4 size-8 text-ink-soft/30"
        strokeWidth={1.25}
        aria-hidden
      />
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-ink-muted">
        {label}
      </p>
      <p
        className={cn(
          "font-serif text-4xl",
          highlight ? "text-brand" : "text-ink",
        )}
      >
        {value}
      </p>
      {caption && (
        <p className="text-xs font-medium text-ink-muted">{caption}</p>
      )}
    </Card>
  );
}

function UsageSummarySkeleton() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className="gap-3 border-border/20 px-6 py-6 shadow-[var(--shadow-soft)]"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-3 w-32" />
        </Card>
      ))}
    </section>
  );
}

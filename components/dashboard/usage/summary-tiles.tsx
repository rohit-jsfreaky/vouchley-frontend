"use client";

import { BarChart3, DollarSign, ReceiptText } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import type { UsageSummary } from "@/lib/api-dashboard";

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
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/20 bg-surface p-6 shadow-[var(--shadow-soft)] ${
        highlight ? "ring-1 ring-brand-soft" : ""
      }`}
    >
      <div className="mb-6 flex items-start justify-between">
        <span className="font-mono text-sm uppercase tracking-wider text-ink-muted">
          {label}
        </span>
        <Icon className="size-5 text-ink-soft" strokeWidth={1.5} aria-hidden />
      </div>
      <div>
        <div
          className={`mb-1 font-serif text-4xl ${
            highlight ? "text-brand" : "text-ink"
          }`}
        >
          {value}
        </div>
        {caption && (
          <div className="text-xs font-medium text-ink-muted">{caption}</div>
        )}
      </div>
    </div>
  );
}

function UsageSummarySkeleton() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex h-36 flex-col justify-between rounded-xl border border-border/20 bg-surface p-6 shadow-[var(--shadow-soft)]"
        >
          <Skeleton className="h-4 w-24" />
          <div>
            <Skeleton className="mb-2 h-10 w-28" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </section>
  );
}

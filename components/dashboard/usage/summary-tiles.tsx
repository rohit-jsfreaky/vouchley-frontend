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
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Tile
        label="Total checks"
        value={data.total_checks.toLocaleString()}
        icon={BarChart3}
      />
      <Tile
        label="Billable operations"
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
        label="Est. cost"
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
    <Card className="gap-0 border-border/20 px-5 py-5 shadow-[var(--shadow-soft)] transition-shadow duration-200 hover:shadow-[var(--shadow-editorial)]">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            highlight ? "bg-brand-soft text-brand" : "bg-subtle text-ink-muted",
          )}
        >
          <Icon className="size-4" strokeWidth={1.75} aria-hidden />
        </span>
        <p className="text-[13px] font-medium text-ink-muted">{label}</p>
      </div>
      <p className="mt-4 text-[34px] font-bold leading-none tabular-nums tracking-tight text-ink">
        {value}
      </p>
      {caption && <p className="mt-2 text-xs text-ink-muted">{caption}</p>}
    </Card>
  );
}

function UsageSummarySkeleton() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className="gap-0 border-border/20 px-5 py-5 shadow-[var(--shadow-soft)]"
        >
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="mt-4 h-9 w-28" />
          <Skeleton className="mt-2 h-3 w-32" />
        </Card>
      ))}
    </section>
  );
}

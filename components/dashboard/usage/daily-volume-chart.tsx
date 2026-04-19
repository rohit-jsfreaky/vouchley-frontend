"use client";

import { BarChart2 } from "lucide-react";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsageDailyPoint } from "@/lib/api-dashboard";

export function DailyVolumeChart({
  data,
  loading,
}: {
  data: UsageDailyPoint[] | null;
  loading: boolean;
}) {
  return (
    <section className="rounded-xl border border-border/20 bg-surface p-8 shadow-[var(--shadow-editorial)]">
      <div className="mb-8">
        <h2 className="font-serif text-2xl text-ink">Daily check volume</h2>
        <p className="mt-1 text-sm text-ink-muted">Activity over the selected period</p>
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={BarChart2}
          title="No volume yet"
          description="Bars will appear as your API starts handling checks."
          className="h-64"
        />
      ) : (
        <BarsSvg points={data} />
      )}
    </section>
  );
}

function BarsSvg({ points }: { points: UsageDailyPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.count));
  const labels = pickLabels(points);
  return (
    <div className="space-y-3">
      <div className="flex h-64 items-end gap-1">
        {points.map((p) => {
          const pct = Math.max(4, (p.count / max) * 100);
          return (
            <div
              key={p.date}
              className="group relative w-full rounded-t-sm bg-gradient-to-t from-brand/40 to-brand transition-opacity hover:opacity-80"
              style={{ height: `${pct}%` }}
              title={`${p.date}: ${p.count}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between font-mono text-xs text-ink-muted">
        <span>{labels.first}</span>
        {labels.mid && <span>{labels.mid}</span>}
        <span>{labels.last}</span>
      </div>
    </div>
  );
}

function pickLabels(points: UsageDailyPoint[]) {
  if (points.length === 0) return { first: "", mid: null as string | null, last: "" };
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return {
    first: fmt(points[0].date),
    mid:
      points.length > 4
        ? fmt(points[Math.floor(points.length / 2)].date)
        : null,
    last: fmt(points[points.length - 1].date),
  };
}

"use client";

import { Database } from "lucide-react";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { CacheHitRate } from "@/lib/api-dashboard";

export function CacheHitDonut({
  data,
  loading,
}: {
  data: CacheHitRate | null;
  loading: boolean;
}) {
  return (
    <section className="flex flex-col rounded-xl border border-border/20 bg-surface p-8 shadow-[var(--shadow-soft)]">
      <h3 className="mb-2 font-serif text-xl text-ink">Cache hit rate</h3>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-6">
          <Skeleton className="size-48 rounded-full" />
        </div>
      ) : !data || data.total === 0 ? (
        <EmptyState
          icon={Database}
          title="No cached checks yet"
          description="Cache hits start counting after the second request for the same input."
          className="mt-6"
        />
      ) : (
        <>
          <div className="flex flex-1 items-center justify-center py-4">
            <div
              className="relative flex size-48 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(var(--color-brand) 0% ${data.hit_rate_pct}%, var(--color-muted) ${data.hit_rate_pct}% 100%)`,
              }}
            >
              <div className="absolute flex size-36 flex-col items-center justify-center rounded-full bg-surface">
                <span className="font-serif text-3xl text-ink">
                  {data.hit_rate_pct.toFixed(1)}%
                </span>
                <span className="font-mono text-xs text-ink-muted">HIT RATE</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <Legend
              color="bg-muted"
              label={`Miss (${data.miss.toLocaleString()})`}
            />
            <Legend
              color="bg-brand"
              label={`Hit (${data.hit.toLocaleString()})`}
            />
          </div>
        </>
      )}
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`size-3 rounded-full ${color}`} />
      <span className="text-ink-muted">{label}</span>
    </div>
  );
}

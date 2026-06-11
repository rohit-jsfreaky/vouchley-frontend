"use client";

import { PieChart } from "lucide-react";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ScoreDistribution } from "@/lib/api-dashboard";

interface Props {
  data: ScoreDistribution | null;
  loading: boolean;
}

const BANDS: Array<{
  key: keyof Omit<ScoreDistribution, "total">;
  label: string;
  range: string;
  color: string;
}> = [
  { key: "excellent", label: "Excellent", range: "90–100", color: "bg-accent" },
  { key: "good", label: "Good", range: "70–89", color: "bg-brand" },
  { key: "fair", label: "Fair", range: "50–69", color: "bg-warning" },
  { key: "poor", label: "Poor", range: "0–49", color: "bg-danger" },
];

export function ScoreDistributionCard({ data, loading }: Props) {
  return (
    <Card className="gap-4 border-border/20 shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-ink">
          Score Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <ScoreDistributionSkeleton />
        ) : !data || data.total === 0 ? (
          <EmptyState
            icon={PieChart}
            title="No scores yet"
            description="Run your first verification to see the score mix here."
            className="h-48"
          />
        ) : (
          <div>
            {/* Single stacked bar: the whole mix at a glance */}
            <div className="flex h-3 w-full gap-px overflow-hidden rounded-full bg-muted">
              {BANDS.map((band) => {
                const pct = (data[band.key] / data.total) * 100;
                if (pct <= 0) return null;
                return (
                  <div
                    key={band.key}
                    className={band.color}
                    style={{ width: `${pct}%` }}
                    title={`${band.label}: ${pct.toFixed(0)}%`}
                  />
                );
              })}
            </div>

            <ul className="mt-5 space-y-3">
              {BANDS.map((band) => {
                const count = data[band.key];
                const pct = (count / data.total) * 100;
                return (
                  <li
                    key={band.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`size-2.5 rounded-full ${band.color}`}
                        aria-hidden
                      />
                      <span className="font-medium text-ink">{band.label}</span>
                      <span className="text-xs text-ink-soft">{band.range}</span>
                    </span>
                    <span className="tabular-nums text-ink-muted">
                      {count.toLocaleString()}
                      <span className="ml-2 inline-block w-10 text-right font-semibold text-ink">
                        {pct.toFixed(0)}%
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreDistributionSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div className="mb-1 flex justify-between">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  );
}

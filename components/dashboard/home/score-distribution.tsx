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
  color: string;
}> = [
  { key: "excellent", label: "Excellent (90-100)", color: "bg-accent" },
  { key: "good", label: "Good (70-89)", color: "bg-brand" },
  { key: "fair", label: "Fair (50-69)", color: "bg-warning" },
  { key: "poor", label: "Poor (0-49)", color: "bg-danger" },
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
          <div className="space-y-4">
            {BANDS.map((band) => {
              const count = data[band.key];
              const pct = data.total > 0 ? (count / data.total) * 100 : 0;
              return (
                <div key={band.key}>
                  <div className="mb-1 flex justify-between text-xs text-ink-muted">
                    <span>{band.label}</span>
                    <span>{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${band.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
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

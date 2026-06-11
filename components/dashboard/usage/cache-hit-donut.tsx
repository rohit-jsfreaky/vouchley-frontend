"use client";

import { Database } from "lucide-react";
import { Cell, Label, Pie, PieChart } from "recharts";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { CacheHitRate } from "@/lib/api-dashboard";

const chartConfig = {
  count: { label: "Checks" },
  hit: { label: "Hit", color: "var(--color-brand)" },
  miss: { label: "Miss", color: "var(--color-muted)" },
} satisfies ChartConfig;

export function CacheHitDonut({
  data,
  loading,
}: {
  data: CacheHitRate | null;
  loading: boolean;
}) {
  const slices = data
    ? [
        { key: "hit", label: "Hit", count: data.hit, fill: "var(--color-brand)" },
        { key: "miss", label: "Miss", count: data.miss, fill: "var(--color-muted)" },
      ]
    : [];

  return (
    <Card className="flex flex-col gap-2 border-border/20 shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-ink">
          Cache hit rate
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
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
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-56 w-full max-w-[14rem]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="label" hideLabel />}
                />
                <Pie
                  data={slices}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={62}
                  paddingAngle={3}
                  cornerRadius={6}
                  strokeWidth={0}
                >
                  {slices.map((slice) => (
                    <Cell key={slice.key} fill={slice.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !("cx" in viewBox)) return null;
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-ink text-3xl font-bold tracking-tight"
                          >
                            {data.hit_rate_pct.toFixed(1)}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 22}
                            className="fill-ink-muted text-xs font-medium"
                          >
                            hit rate
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
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
      </CardContent>
    </Card>
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

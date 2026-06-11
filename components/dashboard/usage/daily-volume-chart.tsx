"use client";

import { BarChart2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsageDailyPoint } from "@/lib/api-dashboard";

const chartConfig = {
  count: { label: "Checks", color: "var(--color-brand)" },
} satisfies ChartConfig;

const fmtDay = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function DailyVolumeChart({
  data,
  loading,
}: {
  data: UsageDailyPoint[] | null;
  loading: boolean;
}) {
  const total = data?.reduce((sum, p) => sum + p.count, 0) ?? 0;

  return (
    <Card className="gap-4 border-border/20 shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardDescription className="text-[13px] font-medium text-ink-muted">
          Daily check volume
        </CardDescription>
        {loading ? (
          <Skeleton className="mt-1 h-8 w-24" />
        ) : (
          <CardTitle className="text-3xl font-bold tabular-nums tracking-tight text-ink">
            {total.toLocaleString()}
            <span className="ml-2 text-sm font-medium tracking-normal text-ink-soft">
              in selected period
            </span>
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
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
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={data} margin={{ left: 8, right: 12, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={fmtDay}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => fmtDay(String(label))}
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

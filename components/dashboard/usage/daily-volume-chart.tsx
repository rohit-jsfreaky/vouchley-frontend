"use client";

import { BarChart2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  return (
    <Card className="gap-4 border-border/20 shadow-[var(--shadow-editorial)]">
      <CardHeader>
        <CardTitle className="font-serif text-2xl font-normal text-ink">
          Daily check volume
        </CardTitle>
        <p className="mt-1 text-sm text-ink-muted">
          Activity over the selected period
        </p>
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
              <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

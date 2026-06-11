"use client";

import { LineChart } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import type { ChecksOverTimePoint } from "@/lib/api-dashboard";

interface Props {
  data: ChecksOverTimePoint[] | null;
  loading: boolean;
}

const chartConfig = {
  count: { label: "Checks", color: "var(--color-brand)" },
} satisfies ChartConfig;

const fmtDay = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function ChecksOverTimeChart({ data, loading }: Props) {
  const total = data?.reduce((sum, p) => sum + p.count, 0) ?? 0;

  return (
    <Card className="gap-4 border-border/20 shadow-[var(--shadow-soft)] lg:col-span-2">
      <CardHeader>
        <CardDescription className="text-[13px] font-medium text-ink-muted">
          Checks over time
        </CardDescription>
        {loading ? (
          <Skeleton className="mt-1 h-8 w-24" />
        ) : (
          <CardTitle className="text-3xl font-bold tabular-nums tracking-tight text-ink">
            {total.toLocaleString()}
            <span className="ml-2 text-sm font-medium tracking-normal text-ink-soft">
              in selected range
            </span>
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : !data || data.length === 0 || total === 0 ? (
          <EmptyState
            icon={LineChart}
            title="No activity yet"
            description="Once your API starts receiving verify requests, the line will appear here."
            cta={{ label: "Read the quickstart", href: "/docs" }}
            className="h-64"
          />
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart
              data={data}
              margin={{ left: 4, right: 10, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillChecks" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-count)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--color-border)"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={24}
                tickFormatter={fmtDay}
                tick={{ fill: "var(--color-ink-soft)", fontSize: 12 }}
              />
              <YAxis hide domain={[0, "dataMax + 2"]} />
              <ChartTooltip
                cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => fmtDay(String(label))}
                  />
                }
              />
              <Area
                dataKey="count"
                type="monotone"
                fill="url(#fillChecks)"
                stroke="var(--color-count)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

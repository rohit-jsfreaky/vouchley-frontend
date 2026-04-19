"use client";

import { LineChart } from "lucide-react";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChecksOverTimePoint } from "@/lib/api-dashboard";

interface Props {
  data: ChecksOverTimePoint[] | null;
  loading: boolean;
}

export function ChecksOverTimeChart({ data, loading }: Props) {
  return (
    <div className="rounded-xl border border-border/20 bg-surface p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-serif text-2xl text-ink">Checks Over Time</h3>
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={LineChart}
          title="No activity yet"
          description="Once your API starts receiving verify requests, the line will appear here."
          cta={{ label: "Read the quickstart", href: "/docs" }}
          className="h-64"
        />
      ) : (
        <LineChartSvg points={data} />
      )}
    </div>
  );
}

function LineChartSvg({ points }: { points: ChecksOverTimePoint[] }) {
  const width = 1000;
  const height = 260;
  const padding = 20;
  const max = Math.max(1, ...points.map((p) => p.count));

  const coords = points.map((p, i) => {
    const x = padding + (i / Math.max(1, points.length - 1)) * (width - padding * 2);
    const y = height - padding - (p.count / max) * (height - padding * 2);
    return { x, y };
  });

  const path = coords
    .map((c, i) => (i === 0 ? `M ${c.x},${c.y}` : `L ${c.x},${c.y}`))
    .join(" ");
  const areaPath = `${path} L ${coords[coords.length - 1]?.x ?? padding},${height - padding} L ${coords[0]?.x ?? padding},${height - padding} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-64 w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((frac) => (
        <line
          key={frac}
          x1={padding}
          x2={width - padding}
          y1={padding + frac * (height - padding * 2)}
          y2={padding + frac * (height - padding * 2)}
          stroke="var(--color-border)"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      ))}

      <path d={areaPath} fill="url(#chart-fill)" />
      <path
        d={path}
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

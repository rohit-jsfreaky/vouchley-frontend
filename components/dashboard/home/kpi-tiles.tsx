"use client";

import {
  FileCheck,
  Gauge,
  MinusSquare,
  ShieldBan,
  Timer,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardKpis, KpiValue } from "@/lib/api-dashboard";
import { cn } from "@/lib/utils";

interface Props {
  data: DashboardKpis | null;
  loading: boolean;
}

export function KpiTiles({ data, loading }: Props) {
  if (loading) return <KpiTilesSkeleton />;
  if (!data) return null;

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Tile
        label="Total Checks"
        icon={FileCheck}
        kpi={data.total_checks}
        format={(v) => Math.round(v).toLocaleString()}
        lowerIsBetter={false}
      />
      <Tile
        label="Avg. Score"
        icon={Gauge}
        kpi={data.avg_score}
        format={(v) => v.toFixed(1)}
        lowerIsBetter={false}
      />
      <Tile
        label="Block Rate"
        icon={ShieldBan}
        kpi={data.block_rate}
        format={(v) => `${v.toFixed(1)}%`}
        lowerIsBetter
      />
      <Tile
        label="Avg. Latency"
        icon={Timer}
        kpi={data.avg_latency_ms}
        format={(v) => (
          <>
            {Math.round(v).toLocaleString()}
            <span className="ml-1 text-xl text-ink-muted">ms</span>
          </>
        )}
        lowerIsBetter
      />
    </section>
  );
}

function Tile({
  label,
  icon: Icon,
  kpi,
  format,
  lowerIsBetter,
}: {
  label: string;
  icon: LucideIcon;
  kpi: KpiValue;
  format: (v: number) => React.ReactNode;
  lowerIsBetter: boolean;
}) {
  const hasValue = kpi.value !== null && kpi.value !== undefined;
  return (
    <Card className="relative gap-3 overflow-hidden border-border/20 px-6 py-6 shadow-[var(--shadow-soft)]">
      <Icon
        className="absolute right-4 top-4 size-8 text-ink-soft/30"
        strokeWidth={1.25}
        aria-hidden
      />
      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
        {label}
      </p>
      <p className="text-3xl font-semibold tabular-nums text-ink">
        {hasValue ? format(kpi.value as number) : "—"}
      </p>
      <Delta delta={kpi.delta_pct} lowerIsBetter={lowerIsBetter} />
    </Card>
  );
}

function Delta({
  delta,
  lowerIsBetter,
}: {
  delta: number | null;
  lowerIsBetter: boolean;
}) {
  if (delta === null || delta === undefined) {
    return (
      <div className="flex items-center gap-1 font-mono text-xs text-ink-soft">
        <MinusSquare className="size-3.5" strokeWidth={1.75} aria-hidden />
        <span>No comparison</span>
      </div>
    );
  }
  if (delta === 0) {
    return (
      <div className="flex items-center gap-1 font-mono text-xs text-ink-muted">
        <MinusSquare className="size-3.5" strokeWidth={1.75} aria-hidden />
        <span>Stable</span>
      </div>
    );
  }
  const positive = delta > 0;
  const good = lowerIsBetter ? !positive : positive;
  return (
    <div
      className={cn(
        "flex items-center gap-1 font-mono text-xs",
        good ? "text-accent" : "text-danger",
      )}
    >
      {positive ? (
        <TrendingUp className="size-3.5" strokeWidth={1.75} aria-hidden />
      ) : (
        <TrendingDown className="size-3.5" strokeWidth={1.75} aria-hidden />
      )}
      <span>{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
    </div>
  );
}

export function KpiTilesSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card
          key={i}
          className="gap-3 border-border/20 px-6 py-6 shadow-[var(--shadow-soft)]"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-3 w-16" />
        </Card>
      ))}
    </section>
  );
}

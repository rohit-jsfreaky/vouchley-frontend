"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  FileCheck,
  Gauge,
  ShieldBan,
  Timer,
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
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Tile
        label="Total checks"
        icon={FileCheck}
        kpi={data.total_checks}
        format={(v) => Math.round(v).toLocaleString()}
        lowerIsBetter={false}
      />
      <Tile
        label="Avg. score"
        icon={Gauge}
        kpi={data.avg_score}
        format={(v) => v.toFixed(1)}
        lowerIsBetter={false}
      />
      <Tile
        label="Block rate"
        icon={ShieldBan}
        kpi={data.block_rate}
        format={(v) => `${v.toFixed(1)}%`}
        lowerIsBetter
      />
      <Tile
        label="Avg. latency"
        icon={Timer}
        kpi={data.avg_latency_ms}
        format={(v) => (
          <>
            {Math.round(v).toLocaleString()}
            <span className="ml-0.5 text-lg font-semibold text-ink-soft">ms</span>
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
    <Card className="gap-0 border-border/20 px-5 py-5 shadow-[var(--shadow-soft)] transition-shadow duration-200 hover:shadow-[var(--shadow-editorial)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-subtle text-ink-muted">
            <Icon className="size-4" strokeWidth={1.75} aria-hidden />
          </span>
          <p className="text-[13px] font-medium text-ink-muted">{label}</p>
        </div>
        <DeltaPill delta={kpi.delta_pct} lowerIsBetter={lowerIsBetter} />
      </div>
      <p className="mt-4 text-[34px] font-bold leading-none tabular-nums tracking-tight text-ink">
        {hasValue ? format(kpi.value as number) : "—"}
      </p>
    </Card>
  );
}

function DeltaPill({
  delta,
  lowerIsBetter,
}: {
  delta: number | null;
  lowerIsBetter: boolean;
}) {
  if (delta === null || delta === undefined || delta === 0) {
    return (
      <span className="rounded-full bg-subtle px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
        {delta === 0 ? "Stable" : "—"}
      </span>
    );
  }
  const positive = delta > 0;
  const good = lowerIsBetter ? !positive : positive;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
        good ? "bg-accent-soft text-accent" : "bg-danger-bg text-danger",
      )}
    >
      {positive ? (
        <ArrowUpRight className="size-3" strokeWidth={2.25} aria-hidden />
      ) : (
        <ArrowDownRight className="size-3" strokeWidth={2.25} aria-hidden />
      )}
      {Math.abs(delta)}%
    </span>
  );
}

export function KpiTilesSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card
          key={i}
          className="gap-0 border-border/20 px-5 py-5 shadow-[var(--shadow-soft)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-9 w-24" />
        </Card>
      ))}
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ChecksOverTimeChart } from "@/components/dashboard/home/checks-over-time-chart";
import { KpiTiles } from "@/components/dashboard/home/kpi-tiles";
import { RecentVerifications } from "@/components/dashboard/home/recent-verifications";
import { ScoreDistributionCard } from "@/components/dashboard/home/score-distribution";
import {
  DashboardDateRangeFilter,
  defaultDashboardRange,
} from "@/components/dashboard/shell/date-range-filter";
import { Button } from "@/components/ui/button";
import {
  type ChecksOverTimePoint,
  type DashboardDateRange,
  type DashboardKpis,
  fetchChecksOverTime,
  fetchKpis,
  fetchRecentChecks,
  fetchScoreDistribution,
  type RecentCheckItem,
  type ScoreDistribution,
} from "@/lib/api-dashboard";

// Local-time day key (yyyy-MM-dd). Using toISOString() here would shift the
// key by the UTC offset, so in non-UTC zones (e.g. IST) "today" lands in a
// bucket the cursor loop never generates — which is why the chart looked empty.
function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizeChartPoints(
  points: ChecksOverTimePoint[] | null,
  range: DashboardDateRange,
): ChecksOverTimePoint[] | null {
  if (!points) return null;
  const start = new Date(`${range.startDate}T00:00:00`);
  const end = new Date(`${range.endDate}T00:00:00`);

  const pointMap = new Map(
    points.map((point) => [dayKey(new Date(point.date)), point.count]),
  );

  const normalized: ChecksOverTimePoint[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const key = dayKey(cursor);
    normalized.push({ date: key, count: pointMap.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return normalized;
}

export function DashboardHomeClient() {
  const [range, setRange] = useState<DashboardDateRange>(defaultDashboardRange);
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [chart, setChart] = useState<ChecksOverTimePoint[] | null>(null);
  const [dist, setDist] = useState<ScoreDistribution | null>(null);
  const [recent, setRecent] = useState<RecentCheckItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setKpis(null);
    setChart(null);
    setDist(null);

    (async () => {
      try {
        const [k, c, d] = await Promise.all([
          fetchKpis(range),
          fetchChecksOverTime(range),
          fetchScoreDistribution(range),
        ]);
        if (cancelled) return;
        setKpis(k);
        setChart(normalizeChartPoints(c.points, range));
        setDist(d);
      } catch (err) {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Could not load dashboard.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [range]);

  useEffect(() => {
    let cancelled = false;
    fetchRecentChecks(10, range)
      .then((r) => {
        if (!cancelled) setRecent(r.checks);
      })
      .catch(() => {
        /* failure is surfaced by the KPI fetch above — avoid double toast */
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Overview of verification activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DashboardDateRangeFilter value={range} onChange={setRange} />
          <Button asChild variant="primary" size="md">
            <Link href="/dashboard/keys">Create key</Link>
          </Button>
        </div>
      </header>

      <KpiTiles data={kpis} loading={loading} />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChecksOverTimeChart data={chart} loading={loading} />
        <ScoreDistributionCard data={dist} loading={loading} />
      </section>

      <RecentVerifications data={recent} loading={recent === null} />
    </div>
  );
}

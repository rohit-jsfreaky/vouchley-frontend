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
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { buttonStyles } from "@/components/ui/button";
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

function normalizeChartPoints(
  points: ChecksOverTimePoint[] | null,
  range: DashboardDateRange,
): ChecksOverTimePoint[] | null {
  if (!points) return null;
  const start = new Date(`${range.startDate}T00:00:00`);
  const end = new Date(`${range.endDate}T00:00:00`);

  const pointMap = new Map(
    points.map((point) => [
      new Date(point.date).toISOString().slice(0, 10),
      point.count,
    ]),
  );

  const normalized: ChecksOverTimePoint[] = [];
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const key = cursor.toISOString().slice(0, 10);
    normalized.push({
      date: key,
      count: pointMap.get(key) ?? 0,
    });
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
    <div className="space-y-12">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of verification activity"
        actions={
          <>
            <DashboardDateRangeFilter value={range} onChange={setRange} />
            <Link
              href="/dashboard/keys"
              className={buttonStyles({ variant: "primary", size: "md", className: "cursor-pointer" })}
            >
              Create key
            </Link>
          </>
        }
      />

      <KpiTiles data={kpis} loading={loading} />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChecksOverTimeChart data={chart} loading={loading} />
        <ScoreDistributionCard data={dist} loading={loading} />
      </section>

      <RecentVerifications data={recent} loading={recent === null} />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ChecksOverTimeChart } from "@/components/dashboard/home/checks-over-time-chart";
import { KpiTiles } from "@/components/dashboard/home/kpi-tiles";
import { RecentVerifications } from "@/components/dashboard/home/recent-verifications";
import { ScoreDistributionCard } from "@/components/dashboard/home/score-distribution";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { PeriodSelector } from "@/components/dashboard/shell/period-selector";
import { buttonStyles } from "@/components/ui/button";
import {
  type ChecksOverTimePoint,
  type DashboardKpis,
  fetchChecksOverTime,
  fetchKpis,
  fetchRecentChecks,
  fetchScoreDistribution,
  type Period,
  type RecentCheckItem,
  type ScoreDistribution,
} from "@/lib/api-dashboard";

export function DashboardHomeClient() {
  const [period, setPeriod] = useState<Period>("7d");
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
          fetchKpis(period),
          fetchChecksOverTime(period),
          fetchScoreDistribution(period),
        ]);
        if (cancelled) return;
        setKpis(k);
        setChart(c.points);
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
  }, [period]);

  useEffect(() => {
    let cancelled = false;
    fetchRecentChecks(10)
      .then((r) => {
        if (!cancelled) setRecent(r.checks);
      })
      .catch(() => {
        /* failure is surfaced by the KPI fetch above — avoid double toast */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-12">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of verification activity"
        actions={
          <>
            <PeriodSelector value={period} onChange={setPeriod} />
            <Link
              href="/dashboard/keys"
              className={buttonStyles({ variant: "primary", size: "md" })}
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

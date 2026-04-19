"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/shell/page-header";
import { PeriodSelector } from "@/components/dashboard/shell/period-selector";
import { UsageByEndpointTable } from "@/components/dashboard/usage/by-endpoint-table";
import { UsageByKeyChart } from "@/components/dashboard/usage/by-key-chart";
import { CacheHitDonut } from "@/components/dashboard/usage/cache-hit-donut";
import { DailyVolumeChart } from "@/components/dashboard/usage/daily-volume-chart";
import { UsageSummaryTiles } from "@/components/dashboard/usage/summary-tiles";
import { Button } from "@/components/ui/button";
import {
  type CacheHitRate,
  fetchCacheHitRate,
  fetchUsageByEndpoint,
  fetchUsageByKey,
  fetchUsageDaily,
  fetchUsageSummary,
  type Period,
  type UsageByEndpointItem,
  type UsageByKeyItem,
  type UsageDailyPoint,
  type UsageSummary,
} from "@/lib/api-dashboard";

export function UsageClient() {
  const [period, setPeriod] = useState<Period>("30d");
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [daily, setDaily] = useState<UsageDailyPoint[] | null>(null);
  const [byKey, setByKey] = useState<{ items: UsageByKeyItem[]; total: number } | null>(
    null,
  );
  const [cacheRate, setCacheRate] = useState<CacheHitRate | null>(null);
  const [byEndpoint, setByEndpoint] = useState<UsageByEndpointItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSummary(null);
    setDaily(null);
    setByKey(null);
    setCacheRate(null);
    setByEndpoint(null);

    (async () => {
      try {
        const [s, d, k, c, e] = await Promise.all([
          fetchUsageSummary(period),
          fetchUsageDaily(period),
          fetchUsageByKey(period),
          fetchCacheHitRate(period),
          fetchUsageByEndpoint(period),
        ]);
        if (cancelled) return;
        setSummary(s);
        setDaily(d.points);
        setByKey(k);
        setCacheRate(c);
        setByEndpoint(e.items);
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err instanceof Error ? err.message : "Couldn't load usage data.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <div className="space-y-12">
      <PageHeader
        title="Usage"
        subtitle="METRICS FOR THE CURRENT BILLING CYCLE"
        actions={
          <>
            <PeriodSelector value={period} onChange={setPeriod} />
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() =>
                toast.info("CSV export is coming soon.", {
                  description: "Tell support if you need this now.",
                })
              }
            >
              <Download className="size-4" strokeWidth={1.75} />
              Export CSV
            </Button>
          </>
        }
      />

      <UsageSummaryTiles data={summary} loading={loading} />

      <DailyVolumeChart data={daily} loading={loading} />

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <UsageByKeyChart
          items={byKey?.items ?? null}
          total={byKey?.total ?? 0}
          loading={loading}
        />
        <CacheHitDonut data={cacheRate} loading={loading} />
      </section>

      <UsageByEndpointTable items={byEndpoint} loading={loading} />

      <p className="text-center font-mono text-xs uppercase tracking-widest text-ink-muted">
        * Cache hits do not count toward quota
      </p>
    </div>
  );
}

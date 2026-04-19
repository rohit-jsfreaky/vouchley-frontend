"use client";

import { TableProperties } from "lucide-react";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsageByEndpointItem } from "@/lib/api-dashboard";

export function UsageByEndpointTable({
  items,
  loading,
}: {
  items: UsageByEndpointItem[] | null;
  loading: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border/20 bg-surface shadow-[var(--shadow-soft)]">
      <div className="border-b border-border/30 p-6">
        <h3 className="font-serif text-xl text-ink">Usage by endpoint</h3>
      </div>
      {loading ? (
        <TableSkeleton />
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon={TableProperties}
          title="No endpoint calls yet"
          description="Once your API starts serving requests, per-endpoint stats appear here."
          className="border-0"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-canvas text-xs font-mono font-medium uppercase tracking-wider text-ink-muted">
                <th className="w-1/2 p-4">Endpoint</th>
                <th className="p-4 text-right">Calls</th>
                <th className="p-4 text-right">Avg Latency</th>
                <th className="p-4 text-right">Error Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-sm">
              {items.map((it) => (
                <tr
                  key={it.endpoint}
                  className="transition-colors hover:bg-canvas/60"
                >
                  <td className="p-4 font-mono text-ink">{it.endpoint}</td>
                  <td className="p-4 text-right font-mono text-ink-muted">
                    {it.count.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono text-ink-muted">
                    {it.avg_latency_ms !== null ? `${it.avg_latency_ms}ms` : "—"}
                  </td>
                  <td className="p-4 text-right font-mono text-ink-muted">
                    {it.error_rate_pct.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function TableSkeleton() {
  return (
    <div className="divide-y divide-border/30">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="ml-auto h-4 w-16" />
          <Skeleton className="ml-auto h-4 w-12" />
          <Skeleton className="ml-auto h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

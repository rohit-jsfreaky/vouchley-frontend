"use client";

import { TableProperties } from "lucide-react";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UsageByEndpointItem } from "@/lib/api-dashboard";

export function UsageByEndpointTable({
  items,
  loading,
}: {
  items: UsageByEndpointItem[] | null;
  loading: boolean;
}) {
  return (
    <Card className="gap-0 overflow-hidden border-border/20 py-0 shadow-[var(--shadow-soft)]">
      <CardHeader className="border-b border-border py-4">
        <CardTitle className="text-lg font-semibold text-ink">
          Usage by endpoint
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <TableSkeleton />
        ) : !items || items.length === 0 ? (
          <EmptyState
            icon={TableProperties}
            title="No endpoint calls yet"
            description="Once your API starts serving requests, per-endpoint stats appear here."
            className="border-0 py-16"
          />
        ) : (
          <Table className="[&_td]:px-5 [&_td]:py-3 [&_th]:h-11 [&_th]:px-5">
            <TableHeader>
              <TableRow className="border-border bg-subtle/40 hover:bg-subtle/40 [&_th]:text-[13px] [&_th]:font-medium [&_th]:text-ink-muted">
                <TableHead className="w-1/2">Endpoint</TableHead>
                <TableHead className="text-right">Calls</TableHead>
                <TableHead className="text-right">Avg latency</TableHead>
                <TableHead className="text-right">Error rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow
                  key={it.endpoint}
                  className="border-border/60 transition-colors hover:bg-subtle/40"
                >
                  <TableCell>
                    <span className="rounded-md border border-border/60 bg-subtle px-2 py-1 font-mono text-xs text-ink">
                      {it.endpoint}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-ink">
                    {it.count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-ink-muted">
                    {it.avg_latency_ms !== null ? `${it.avg_latency_ms}ms` : "—"}
                  </TableCell>
                  <TableCell
                    className={
                      it.error_rate_pct > 0
                        ? "text-right tabular-nums font-medium text-danger"
                        : "text-right tabular-nums text-ink-muted"
                    }
                  >
                    {it.error_rate_pct.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
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

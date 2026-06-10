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
      <CardHeader className="border-b border-border/30 bg-subtle/60 py-4">
        <CardTitle className="font-serif text-xl font-normal text-ink">
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
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-1/2">Endpoint</TableHead>
                <TableHead className="text-right">Calls</TableHead>
                <TableHead className="text-right">Avg Latency</TableHead>
                <TableHead className="text-right">Error Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.endpoint}>
                  <TableCell className="font-mono text-ink">
                    {it.endpoint}
                  </TableCell>
                  <TableCell className="text-right font-mono text-ink-muted">
                    {it.count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-ink-muted">
                    {it.avg_latency_ms !== null ? `${it.avg_latency_ms}ms` : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-ink-muted">
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

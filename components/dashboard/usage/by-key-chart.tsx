"use client";

import { KeyRound } from "lucide-react";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsageByKeyItem } from "@/lib/api-dashboard";

// Monochrome brand scale: rank reads through opacity, not rainbow colors.
const BAR_COLORS = ["bg-brand", "bg-brand/70", "bg-brand/45", "bg-brand/25"];

export function UsageByKeyChart({
  items,
  total,
  loading,
}: {
  items: UsageByKeyItem[] | null;
  total: number;
  loading: boolean;
}) {
  return (
    <Card className="gap-4 border-border/20 shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-ink">
          Usage by API key
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <UsageByKeySkeleton />
        ) : !items || items.length === 0 || total === 0 ? (
          <EmptyState
            icon={KeyRound}
            title="No key usage yet"
            description="Once your keys start making calls, totals and bars will appear here."
          />
        ) : (
          <div className="space-y-5">
            {items.map((item, i) => {
              const pct = total > 0 ? (item.count / total) * 100 : 0;
              return (
                <div key={item.key_id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="truncate font-medium text-ink">
                      {item.label || (
                        <span className="font-mono text-[13px]">
                          {item.key_prefix}…
                        </span>
                      )}
                    </span>
                    <span className="ml-3 shrink-0 tabular-nums text-ink-muted">
                      {item.count.toLocaleString()}
                      <span className="ml-2 inline-block w-10 text-right font-semibold text-ink">
                        {pct.toFixed(0)}%
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${
                        BAR_COLORS[i % BAR_COLORS.length]
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UsageByKeySkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i}>
          <div className="mb-1 flex justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  );
}

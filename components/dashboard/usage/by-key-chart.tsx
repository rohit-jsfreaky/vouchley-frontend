"use client";

import { KeyRound } from "lucide-react";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsageByKeyItem } from "@/lib/api-dashboard";

const BAR_COLORS = ["bg-brand", "bg-info", "bg-ink-muted", "bg-ink-soft"];

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
        <CardTitle className="font-serif text-xl font-normal text-ink">
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
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-mono font-medium text-ink">
                      {item.label || item.key_prefix}
                    </span>
                    <span className="font-mono text-ink-muted">
                      {item.count.toLocaleString()}
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

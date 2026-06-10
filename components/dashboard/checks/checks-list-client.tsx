"use client";

import { FileSearch, Globe } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import {
  RecommendationBadge,
  ScoreValue,
} from "@/components/dashboard/shared/status-badges";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/lib/api";
import { type RecentCheckItem, fetchRecentChecks } from "@/lib/api-dashboard";

export function ChecksListClient() {
  const [checks, setChecks] = useState<RecentCheckItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchRecentChecks(50, undefined, "all");
        setChecks(res.checks);
      } catch (err) {
        toast.error(
          err instanceof ApiError ? err.message : "Couldn't load checks.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <PageHeader
        title="Check Inspector"
        subtitle="Browse and inspect individual verification checks."
      />

      {loading ? (
        <ChecksTableSkeleton />
      ) : !checks || checks.length === 0 ? (
        <EmptyState
          icon={FileSearch}
          title="No checks yet"
          description="When your app calls POST /v1/verify, checks will appear here for inspection."
          cta={{ label: "Read the quickstart", href: "/docs" }}
          className="py-20"
        />
      ) : (
        <Card className="overflow-hidden border-border/20 p-0 shadow-[var(--shadow-soft)]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Check ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>IP Country</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checks.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/checks/${c.id}`}
                      className="font-mono text-xs text-brand underline-offset-2 hover:underline"
                    >
                      {c.id.length > 16 ? `${c.id.slice(0, 12)}...` : c.id}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate font-mono text-xs">
                    {c.email || "—"}
                  </TableCell>
                  <TableCell className="font-mono">
                    <ScoreValue score={c.score} />
                  </TableCell>
                  <TableCell>
                    <RecommendationBadge value={c.recommendation} />
                  </TableCell>
                  <TableCell>
                    {c.ip_country ? (
                      <span className="flex items-center gap-2 text-ink-muted">
                        <Globe className="size-3.5" strokeWidth={1.75} />
                        {c.ip_country}
                      </span>
                    ) : (
                      <span className="text-ink-soft">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    {relativeTime(c.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ChecksTableSkeleton() {
  return (
    <Card className="overflow-hidden border-border/20 p-0 shadow-[var(--shadow-soft)]">
      <div className="border-b border-border/30 bg-muted/60 px-6 py-4">
        <Skeleton className="h-4 w-40" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-6 items-center gap-6 border-b border-border/30 bg-surface px-6 py-5"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </Card>
  );
}

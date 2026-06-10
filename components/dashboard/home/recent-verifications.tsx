"use client";

import { Globe, ListChecks } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import {
  RecommendationBadge,
  ScoreValue,
} from "@/components/dashboard/shared/status-badges";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RecentCheckItem } from "@/lib/api-dashboard";

interface Props {
  data: RecentCheckItem[] | null;
  loading: boolean;
}

export function RecentVerifications({ data, loading }: Props) {
  return (
    <Card className="gap-0 overflow-hidden border-border/20 py-0 shadow-[var(--shadow-soft)]">
      <CardHeader className="border-b border-border py-4">
        <CardTitle className="text-lg font-semibold text-ink">
          Recent Verifications
        </CardTitle>
        <CardAction>
          <Link
            href="/dashboard/checks"
            className="text-sm font-medium text-brand hover:underline"
          >
            View all
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <RecentVerificationsSkeleton />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No verifications yet"
            description="When your app calls POST /v1/verify, the latest checks will stream into this table."
            cta={{ label: "Read the quickstart", href: "/docs" }}
            className="border-0 py-16"
          />
        ) : (
          <Table className="[&_td]:px-5 [&_td]:py-3.5 [&_th]:h-11 [&_th]:px-5">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent [&_th]:text-xs [&_th]:font-medium [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-ink-soft">
                <TableHead>Email / Identifier</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead>IP Country</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((c) => (
                <TableRow key={c.id} className="border-border/60">
                  <TableCell className="max-w-[260px] truncate">
                    <Link
                      href={`/dashboard/checks/${c.id}`}
                      className="font-medium text-ink underline-offset-2 hover:text-brand hover:underline"
                    >
                      {c.email || "—"}
                    </Link>
                  </TableCell>
                  <TableCell>
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
                    {c.api_key_label || "API"}
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    {relativeTime(c.created_at)}
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
  return `${days}d ago`;
}

function RecentVerificationsSkeleton() {
  return (
    <div className="divide-y divide-border/60">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-6 px-5 py-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </div>
  );
}

"use client";

import { FileSearch, Globe } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { type RecentCheckItem, fetchRecentChecks } from "@/lib/api-dashboard";
import { cn } from "@/lib/utils";

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
        <section className="overflow-hidden rounded-2xl border border-border/20 bg-subtle/60 shadow-[var(--shadow-editorial)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead>
                <tr className="border-b border-border/30 bg-muted/60 text-ink-muted">
                  <th className="px-6 py-4 font-semibold">Check ID</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Score</th>
                  <th className="px-6 py-4 font-semibold">Result</th>
                  <th className="px-6 py-4 font-semibold">IP Country</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 bg-surface text-ink">
                {checks.map((c) => (
                  <tr key={c.id} className="group transition-colors hover:bg-canvas">
                    <td className="px-6 py-5">
                      <Link
                        href={`/dashboard/checks/${c.id}`}
                        className="font-mono text-xs text-brand underline-offset-2 hover:underline"
                      >
                        {c.id.length > 16
                          ? `${c.id.slice(0, 12)}...`
                          : c.id}
                      </Link>
                    </td>
                    <td className="max-w-[220px] truncate px-6 py-5 font-mono text-xs">
                      {c.email || "—"}
                    </td>
                    <td className="px-6 py-5">
                      {c.score !== null ? (
                        <span className={scoreTone(c.score)}>{c.score}</span>
                      ) : (
                        <span className="text-ink-soft">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <RecommendationBadge value={c.recommendation} />
                    </td>
                    <td className="px-6 py-5">
                      {c.ip_country ? (
                        <span className="flex items-center gap-2 text-ink-muted">
                          <Globe className="size-3.5" strokeWidth={1.75} />
                          {c.ip_country}
                        </span>
                      ) : (
                        <span className="text-ink-soft">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-ink-muted">
                      {relativeTime(c.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function scoreTone(score: number): string {
  if (score >= 70) return "font-semibold text-accent";
  if (score >= 40) return "text-ink-muted";
  return "font-semibold text-brand";
}

function RecommendationBadge({ value }: { value: string | null }) {
  const label = (value || "—").toUpperCase();
  const palette =
    value === "approve"
      ? "bg-accent-soft text-accent"
      : value === "block"
        ? "bg-danger-bg text-danger"
        : value === "review"
          ? "bg-muted text-ink-muted"
          : "bg-subtle text-ink-muted";
  return (
    <span
      className={cn(
        "inline-flex rounded px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider",
        palette,
      )}
    >
      {label}
    </span>
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
    <section className="overflow-hidden rounded-2xl border border-border/20 bg-subtle/60 shadow-[var(--shadow-editorial)]">
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
    </section>
  );
}

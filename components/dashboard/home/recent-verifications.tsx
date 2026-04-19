"use client";

import { Globe, ListChecks } from "lucide-react";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecentCheckItem } from "@/lib/api-dashboard";
import { cn } from "@/lib/utils";

interface Props {
  data: RecentCheckItem[] | null;
  loading: boolean;
}

export function RecentVerifications({ data, loading }: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-border/20 bg-surface shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-border/30 bg-subtle/70 px-6 py-4">
        <h3 className="font-serif text-2xl text-ink">Recent Verifications</h3>
      </div>

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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border/30 bg-surface text-xs font-semibold uppercase tracking-widest text-ink-muted">
                <th className="px-6 py-3">Email / Identifier</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Recommendation</th>
                <th className="px-6 py-3">IP Country</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 font-mono text-sm text-ink">
              {data.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-subtle/60">
                  <td className="max-w-[260px] truncate px-6 py-4">
                    {c.email || "—"}
                  </td>
                  <td className="px-6 py-4">
                    {c.score !== null ? (
                      <span className={scoreTone(c.score)}>{c.score}</span>
                    ) : (
                      <span className="text-ink-soft">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <RecommendationBadge value={c.recommendation} />
                  </td>
                  <td className="px-6 py-4">
                    {c.ip_country ? (
                      <span className="flex items-center gap-2 text-ink-muted">
                        <Globe className="size-3.5" strokeWidth={1.75} />
                        {c.ip_country}
                      </span>
                    ) : (
                      <span className="text-ink-soft">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-ink-muted">
                    {c.api_key_label || "API"}
                  </td>
                  <td className="px-6 py-4 text-ink-muted">
                    {relativeTime(c.created_at)}
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

function scoreTone(score: number): string {
  if (score >= 70) return "text-accent";
  if (score >= 40) return "text-ink-muted";
  return "text-brand";
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
    <span className={cn("rounded px-2 py-1 font-mono text-xs font-semibold", palette)}>
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
  return `${days}d ago`;
}

function RecentVerificationsSkeleton() {
  return (
    <div className="divide-y divide-border/30">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-6 px-6 py-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </div>
  );
}

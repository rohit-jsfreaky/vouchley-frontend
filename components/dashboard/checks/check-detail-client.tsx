"use client";

import {
  ArrowLeft,
  Building2,
  Check,
  Copy,
  Globe,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  RecommendationBadge,
  SignalBadge,
} from "@/components/dashboard/shared/status-badges";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { type CheckDetail, fetchCheckDetail } from "@/lib/api-dashboard";

interface Props {
  checkId: string;
}

export function CheckDetailClient({ checkId }: Props) {
  const [check, setCheck] = useState<CheckDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const c = await fetchCheckDetail(checkId);
        setCheck(c);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Couldn't load check.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [checkId]);

  async function handleCopyJson() {
    if (!check?.full_response) return;
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(check.full_response, null, 2),
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  if (loading) return <DetailSkeleton />;
  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-danger">{error}</p>
        <Link
          href="/dashboard/checks"
          className="mt-4 inline-flex items-center gap-2 text-sm text-brand hover:underline"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} />
          Back to all checks
        </Link>
      </div>
    );
  }
  if (!check) return null;

  const resp = check.full_response ?? {};
  const emailSignals = (resp.email ?? {}) as Record<string, unknown>;
  const companySignals = (resp.company ?? {}) as Record<string, unknown>;
  const ipSignals = (resp.ip ?? {}) as Record<string, unknown>;
  const reasoning = (resp.reasoning ?? "") as string;

  return (
    <div>
      <Link
        href="/dashboard/checks"
        className="mb-4 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} />
        Back to all checks
      </Link>

      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Check details
        </h1>
        <span className="rounded-md border border-border/60 bg-subtle px-2 py-1 font-mono text-xs text-ink-muted">
          {check.id.length > 16 ? `${check.id.slice(0, 12)}…` : check.id}
        </span>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <RecommendationBadge value={check.recommendation} />
        <span className="text-xs text-ink-muted">
          {formatTimestamp(check.created_at)}
        </span>
      </div>

      {/* ---- KPI tiles ---- */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Verification score"
          value={
            check.score !== null ? (
              <span>
                <span className="text-[34px] font-bold leading-none tabular-nums tracking-tight text-ink">
                  {check.score}
                </span>
                <span className="ml-1 text-lg font-semibold text-ink-soft">
                  /100
                </span>
              </span>
            ) : (
              <span className="text-ink-soft">—</span>
            )
          }
        />
        <StatCard
          label="Processing time"
          value={
            check.processed_in_ms !== null ? (
              <span>
                <span className="text-[34px] font-bold leading-none tabular-nums tracking-tight text-ink">
                  {check.processed_in_ms}
                </span>
                <span className="ml-1 text-lg font-semibold text-ink-soft">
                  ms
                </span>
              </span>
            ) : (
              <span className="text-ink-soft">—</span>
            )
          }
        />
        <StatCard
          label="API key used"
          value={
            <span className="inline-flex rounded-md border border-border/60 bg-subtle px-2 py-1 font-mono text-xs text-ink-muted">
              {check.api_key_prefix ? `${check.api_key_prefix}…` : "—"}
            </span>
          }
        />
      </div>

      {/* ---- Signal breakdown + Raw JSON ---- */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Signal breakdown */}
        <section>
          <h2 className="mb-5 text-lg font-semibold text-ink">
            Signal breakdown
          </h2>

          {reasoning && (
            <Card className="mb-5 gap-2 border-border/20 px-6 py-5 shadow-[var(--shadow-soft)]">
              <p className="text-[13px] font-medium text-ink-muted">Reasoning</p>
              <p className="text-[15px] leading-7 text-ink">{reasoning}</p>
            </Card>
          )}

          <div className="space-y-4">
            <SignalCard
              icon={Mail}
              title="Email"
              status={emailBadge(emailSignals)}
              rows={[{ label: null, value: check.email ?? "—" }]}
            />
            <SignalCard
              icon={Building2}
              title="Company"
              status={companyBadge(companySignals)}
              rows={[
                {
                  label: "Name",
                  value:
                    check.company_name ??
                    (companySignals.domain as string) ??
                    "—",
                },
                {
                  label: "Domain age",
                  value: companySignals.domain_age_days
                    ? `${Math.round(Number(companySignals.domain_age_days) / 365)} yrs`
                    : "—",
                },
              ]}
            />
            <SignalCard
              icon={Globe}
              title="IP Address"
              status={ipBadge(ipSignals)}
              rows={[
                {
                  label: "Address",
                  value: check.ip_address ?? "—",
                },
                {
                  label: "Location",
                  value: (ipSignals.country as string) ?? "—",
                },
              ]}
            />
          </div>
        </section>

        {/* Raw JSON */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Raw output</h2>
            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-hover"
            >
              {copied ? (
                <>
                  <Check className="size-4" strokeWidth={2.5} />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" strokeWidth={1.75} />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl bg-[#13151b] text-[#e7e9ee] shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-5 py-3" aria-hidden>
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="ml-auto font-mono text-[11px] text-white/40">
                response.json
              </span>
            </div>
            <pre className="max-h-[600px] overflow-auto p-5 font-mono text-xs leading-6">
              <code>
                {check.full_response
                  ? JSON.stringify(check.full_response, null, 2)
                  : "No response data"}
              </code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="gap-3 border-border/20 px-5 py-5 shadow-[var(--shadow-soft)]">
      <p className="text-[13px] font-medium text-ink-muted">{label}</p>
      <div>{value}</div>
    </Card>
  );
}

function SignalCard({
  icon: Icon,
  title,
  status,
  rows,
}: {
  icon: React.ElementType;
  title: string;
  status: { label: string; tone: "good" | "bad" | "neutral" };
  rows: { label: string | null; value: string }[];
}) {
  return (
    <Card className="gap-0 border-border/20 px-5 py-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-subtle text-ink-muted">
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
          <span className="text-sm font-semibold text-ink">{title}</span>
        </div>
        <SignalBadge label={status.label} tone={status.tone} />
      </div>
      <Separator className="my-3.5 bg-border/40" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
        {rows.map((r, i) => (
          <div key={i}>
            {r.label && (
              <p className="mb-0.5 text-xs text-ink-soft">{r.label}</p>
            )}
            <p className="font-mono text-[13px] text-ink">{r.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function emailBadge(
  s: Record<string, unknown>,
): { label: string; tone: "good" | "bad" | "neutral" } {
  if (s.disposable) return { label: "Disposable", tone: "bad" };
  if (s.valid === false) return { label: "Invalid", tone: "bad" };
  if (s.valid === true) return { label: "Valid", tone: "good" };
  return { label: "Unknown", tone: "neutral" };
}

function companyBadge(
  s: Record<string, unknown>,
): { label: string; tone: "good" | "bad" | "neutral" } {
  if (s.domain_alive === true) return { label: "Verified", tone: "good" };
  if (s.domain_alive === false) return { label: "Unverified", tone: "bad" };
  return { label: "Unknown", tone: "neutral" };
}

function ipBadge(
  s: Record<string, unknown>,
): { label: string; tone: "good" | "bad" | "neutral" } {
  if (s.is_vpn === true || s.is_tor === true)
    return { label: "Flagged", tone: "bad" };
  const risk = s.risk_score as number | undefined;
  if (risk !== undefined && risk > 50) return { label: "Risky", tone: "bad" };
  return { label: "Clean", tone: "good" };
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    })
  );
}

function DetailSkeleton() {
  return (
    <div>
      <Skeleton className="mb-4 h-4 w-36" />
      <Skeleton className="mb-2 h-10 w-72" />
      <Skeleton className="mb-8 h-5 w-48" />
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/20 bg-surface p-6"
          >
            <Skeleton className="mb-3 h-3 w-28" />
            <Skeleton className="h-10 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div>
          <Skeleton className="mb-6 h-7 w-28" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

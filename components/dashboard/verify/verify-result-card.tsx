"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import {
  RecommendationBadge,
  ScoreValue,
} from "@/components/dashboard/shared/status-badges";
import { Card } from "@/components/ui/card";
import type { VerifyResult } from "@/lib/api-verify";
import { cn } from "@/lib/utils";

function Signal({
  label,
  bad,
  good,
}: {
  label: string;
  /** true = this is a risk signal that is present (rendered red) */
  bad?: boolean;
  /** true = positive signal present (rendered green) */
  good?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-b-0">
      <span className="text-sm text-ink-muted">{label}</span>
      {bad ? (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-danger">
          <XCircle className="size-4" /> Yes
        </span>
      ) : (
        <span
          className={cn(
            "inline-flex items-center gap-1 text-sm font-medium",
            good ? "text-accent" : "text-ink-soft",
          )}
        >
          <CheckCircle2 className="size-4" /> {good ? "Yes" : "No"}
        </span>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-b-0">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className="text-sm font-medium text-ink">{value ?? "—"}</span>
    </div>
  );
}

export function VerifyResultCard({ result }: { result: VerifyResult }) {
  const { email, company, ip, person } = result;
  const hasIp = ip.country || ip.asn || ip.risk_score !== null;

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between gap-4 border-b border-border bg-subtle/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-14 flex-col items-center justify-center rounded-xl border border-border bg-canvas">
            <ScoreValue score={result.score} className="text-xl" />
            <span className="text-[10px] uppercase tracking-wider text-ink-soft">
              /100
            </span>
          </div>
          <div>
            <RecommendationBadge value={result.recommendation} />
            <p className="mt-1 max-w-md text-sm leading-snug text-ink-muted">
              {result.reasoning}
            </p>
          </div>
        </div>
        <div className="hidden shrink-0 text-right text-xs text-ink-soft sm:block">
          {result.cached ? "cached" : "live"} · {result.processed_in_ms}ms
        </div>
      </div>

      {result.flags.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3">
          {result.flags.map((f) => (
            <span
              key={f}
              className="rounded bg-danger-bg px-2 py-0.5 font-mono text-[11px] font-medium text-danger"
            >
              {f}
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-x-8 gap-y-5 px-5 py-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Email
          </h4>
          <Signal label="Valid syntax" good={email.valid} />
          <Signal label="Disposable / throwaway" bad={email.disposable} />
          <Signal label="Mail server (MX)" good={email.mx_record} />
          <Signal label="Role-based (info@, admin@)" bad={email.role_based} />
          <Signal label="Free provider" bad={email.free_provider} />
        </div>

        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Domain / company
          </h4>
          <Field label="Domain" value={company.domain} />
          <Signal label="Domain resolves" good={company.domain_alive} />
          <Signal label="Has website" good={company.has_website} />
          <Field
            label="Domain age"
            value={
              company.domain_age_days !== null
                ? `${company.domain_age_days} days`
                : "—"
            }
          />
          {company.industry_guess && (
            <Field label="Industry" value={company.industry_guess} />
          )}
        </div>

        {hasIp && (
          <div>
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              IP intelligence
            </h4>
            <Field label="Country" value={ip.country} />
            <Field label="Network" value={ip.asn_org} />
            <Signal label="Datacenter / hosting" bad={ip.is_datacenter === true} />
            <Signal label="VPN" bad={ip.is_vpn === true} />
            <Signal label="Proxy" bad={ip.is_proxy === true} />
            <Signal label="Tor" bad={ip.is_tor === true} />
            <Signal label="Known abuser" bad={ip.is_abuser === true} />
            {ip.risk_score !== null && (
              <Field label="IP risk" value={`${ip.risk_score}/100`} />
            )}
          </div>
        )}

        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Person
          </h4>
          <Signal label="Name matches email" good={person.name_matches_email} />
          {person.likely_at_company !== null && (
            <Signal
              label="Likely at company"
              good={person.likely_at_company === true}
            />
          )}
          <Field
            label="Confidence"
            value={`${Math.round(person.confidence * 100)}%`}
          />
        </div>
      </div>

      <div className="border-t border-border px-5 py-2 font-mono text-[11px] text-ink-soft">
        {result.request_id}
      </div>
    </Card>
  );
}

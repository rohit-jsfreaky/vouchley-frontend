"use client";

import { AlertCircle, CheckCircle2, Loader2, ShieldX, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Verdict = "approve" | "review" | "block";

type CheckResult = {
  email: string;
  valid: boolean;
  disposable?: boolean;
  free_provider?: boolean;
  role_based?: boolean;
  mx_found?: boolean;
  service?: string | null;
  recommendation: Verdict;
  reason: string;
};

const VERDICT_STYLE: Record<Verdict, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  approve: { label: "Looks legit", className: "bg-accent-soft text-accent", Icon: CheckCircle2 },
  review: { label: "Review", className: "bg-warning-bg text-warning", Icon: AlertCircle },
  block: { label: "Block", className: "bg-danger-bg text-danger", Icon: ShieldX },
};

function SignalRow({ label, value }: { label: string; value: boolean | undefined }) {
  if (value === undefined) return null;
  return (
    <div className="flex items-center justify-between border-b border-border/70 py-2 last:border-b-0">
      <span className="text-sm text-ink-muted">{label}</span>
      {value ? (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-danger">
          <XCircle className="size-4" /> Yes
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
          <CheckCircle2 className="size-4" /> No
        </span>
      )}
    </div>
  );
}

export function DisposableEmailChecker() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/tools/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Try again.");
      } else {
        setResult(data as CheckResult);
      }
    } catch {
      setError("Could not reach the checker. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const verdict = result?.recommendation ? VERDICT_STYLE[result.recommendation] : null;

  return (
    <div className="mx-auto w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          inputMode="email"
          autoComplete="off"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 flex-1 text-base"
          aria-label="Email address to check"
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading || !email.trim()}
          className="h-12 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Checking
            </>
          ) : (
            "Check email"
          )}
        </Button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {result && verdict && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3 border-b border-border bg-subtle/50 px-5 py-4">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                verdict.className,
              )}
            >
              <verdict.Icon className="size-3.5" /> {verdict.label}
            </span>
            <span className="truncate font-mono text-sm text-ink">{result.email}</span>
          </div>

          <div className="px-5 py-4">
            <p className="mb-4 text-sm leading-relaxed text-ink">{result.reason}</p>
            {result.valid && (
              <div className="rounded-xl border border-border bg-canvas/60 px-4 py-1">
                <SignalRow label="Disposable / throwaway" value={result.disposable} />
                <SignalRow label="No mail server (MX)" value={result.mx_found === false} />
                <SignalRow label="Role-based (info@, admin@)" value={result.role_based} />
                <SignalRow label="Free provider (Gmail, etc.)" value={result.free_provider} />
              </div>
            )}
          </div>

          <div className="border-t border-border bg-brand-soft/40 px-5 py-4">
            <p className="text-sm text-ink-muted">
              This free checker covers <strong className="text-ink">email + domain</strong>{" "}
              signals. The full{" "}
              <Link href="/docs/api/verify" className="font-medium text-brand hover:underline">
                Vouchley API
              </Link>{" "}
              also scores IP reputation, VPN/proxy/Tor, datacenter, and bot risk in
              one call — with a 0–100 score.{" "}
              <Link href="/signup" className="font-medium text-brand hover:underline">
                Try it free →
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

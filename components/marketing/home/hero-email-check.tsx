"use client";

import { ArrowRight, Loader2, ShieldCheck, ShieldX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

type Verdict = "approve" | "review" | "block";

type CheckResult = {
  email: string;
  valid: boolean;
  disposable?: boolean;
  recommendation: Verdict;
  reason: string;
};

const PILL: Record<Verdict, { label: string; className: string }> = {
  approve: { label: "Looks legit", className: "bg-accent-soft text-accent" },
  review: { label: "Review", className: "bg-warning-bg text-warning" },
  block: { label: "Block", className: "bg-danger-bg text-danger" },
};

/**
 * Compact hero verifier — a real check anyone can run without signing up. Uses
 * the free /api/tools/check-email endpoint (email + domain only, no credits),
 * then nudges to sign up for the full IP/VPN/bot verification.
 */
export function HeroEmailCheck() {
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
      if (!res.ok) setError(data?.error ?? "Something went wrong.");
      else setResult(data as CheckResult);
    } catch {
      setError("Could not reach the checker. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const pill = result ? PILL[result.recommendation] : null;
  const good = result?.recommendation === "approve";

  return (
    <div className="mx-auto mt-8 w-full max-w-lg text-left">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-xl border border-border bg-white/80 p-1.5 shadow-sm backdrop-blur"
      >
        <input
          type="email"
          inputMode="email"
          autoComplete="off"
          placeholder="Enter an email to verify"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address to verify"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[15px] text-ink outline-none placeholder:text-ink-soft"
        />
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Verify"}
        </button>
      </form>

      {error && <p className="mt-2 px-1 text-sm text-danger">{error}</p>}

      {result && pill && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-border bg-white/70 px-4 py-3 backdrop-blur">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
              pill.className,
            )}
          >
            {good ? (
              <ShieldCheck className="size-3.5" />
            ) : (
              <ShieldX className="size-3.5" />
            )}
            {pill.label}
          </span>
          <span className="min-w-0 flex-1 text-sm text-ink-muted">
            {result.reason}
          </span>
        </div>
      )}

      <p className="mt-2 px-1 text-xs text-ink-muted">
        Quick email + domain check.{" "}
        <Link
          href="/signup"
          className="inline-flex items-center gap-0.5 font-medium text-brand hover:underline"
        >
          Sign up free for full verification — IP, VPN, proxy &amp; bot
          <ArrowRight className="size-3" strokeWidth={2.25} />
        </Link>
      </p>
    </div>
  );
}

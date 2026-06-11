"use client";

import { ArrowRight, BarChart3, BookOpen, Check, KeyRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchBillingOverview } from "@/lib/api-billing";

/**
 * Post-checkout confirmation. Polls the backend for a few seconds to let
 * Dodo's webhook land; once the credit balance has changed (or we've polled
 * long enough) we show the current number.
 */
export function BillingSuccessClient() {
  const [balance, setBalance] = useState<number | null>(null);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let initial: number | null = null;

    async function poll() {
      if (cancelled) return;
      try {
        const data = await fetchBillingOverview();
        if (cancelled) return;
        if (initial === null) initial = data.credits_balance;
        setBalance(data.credits_balance);

        // If the balance has increased, stop — webhook has landed.
        if (initial !== null && data.credits_balance > initial) {
          setPolling(false);
          return;
        }

        attempts += 1;
        if (attempts < 8) {
          window.setTimeout(poll, 1500);
        } else {
          setPolling(false);
        }
      } catch {
        // Leave polling flag — user can refresh manually.
        setPolling(false);
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="absolute left-1/2 top-1/2 -z-10 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft/30 blur-3xl" />

      <Card className="w-full max-w-[560px] border-border/20 shadow-[var(--shadow-editorial)]">
        <CardContent className="p-10 md:p-14">
          <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full bg-accent-soft">
            <Check className="size-12 text-accent" strokeWidth={3} aria-hidden />
          </div>

          <h1 className="mb-4 text-center text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Payment received
          </h1>

          <p className="mx-auto mb-10 max-w-sm text-center text-lg leading-relaxed text-ink-muted">
            {polling ? (
              <>
                Thanks for upgrading. We&rsquo;re crediting your account now — this
                usually takes a few seconds.
              </>
            ) : balance !== null ? (
              <>
                Thanks for upgrading. Your balance is{" "}
                <span className="font-bold tabular-nums text-brand">
                  {balance.toLocaleString()}
                </span>{" "}
                credits.
              </>
            ) : (
              <>
                Thanks for upgrading. Credits will appear within a minute — refresh
                your dashboard if you don&rsquo;t see them yet.
              </>
            )}
          </p>

          <div className="mb-8 flex flex-col gap-1 rounded-lg bg-canvas p-1">
            <ActionLink
              href="/dashboard/keys"
              icon={KeyRound}
              title="Create API key"
              sub="Connect your app"
            />
            <ActionLink
              href="/docs"
              icon={BookOpen}
              title="Read quickstart"
              sub="Documentation"
            />
            <ActionLink
              href="/dashboard/usage"
              icon={BarChart3}
              title="See usage dashboard"
              sub="Monitor metrics"
            />
          </div>

          <p className="mb-8 text-center text-[13px] text-ink-soft">
            A receipt has been sent to your email.
          </p>

          <div className="text-center">
            <Button asChild variant="primary" size="lg">
              <Link href="/dashboard">Return to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function ActionLink({
  href,
  icon: Icon,
  title,
  sub,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded bg-surface p-4 text-left transition-colors hover:bg-subtle"
    >
      <div className="flex items-center gap-4">
        <Icon className="size-5 text-brand" strokeWidth={1.75} aria-hidden />
        <div>
          <span className="block font-semibold text-ink group-hover:text-brand">
            {title}
          </span>
          <span className="mt-0.5 block text-xs text-ink-muted">{sub}</span>
        </div>
      </div>
      <ArrowRight
        className="size-4 text-ink-soft transition-transform group-hover:translate-x-1 group-hover:text-brand"
        strokeWidth={1.75}
        aria-hidden
      />
    </Link>
  );
}

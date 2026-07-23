"use client";

import { useCallback, useEffect, useState } from "react";

import { BulkVerify } from "@/components/dashboard/verify/bulk-verify";
import { SingleVerify } from "@/components/dashboard/verify/single-verify";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { fetchBillingOverview } from "@/lib/api-billing";
import { cn } from "@/lib/utils";

type Tab = "single" | "bulk";

const TABS: { id: Tab; label: string }[] = [
  { id: "single", label: "Single email" },
  { id: "bulk", label: "Bulk list" },
];

export function VerifyClient() {
  const [tab, setTab] = useState<Tab>("single");
  const [balance, setBalance] = useState<number | null>(null);

  const refreshBalance = useCallback(async () => {
    try {
      const overview = await fetchBillingOverview();
      setBalance(overview.credits_balance);
    } catch {
      /* leave balance as-is; guardrails still work off the last known value */
    }
  }, []);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return (
    <div>
      <PageHeader
        title="Verify"
        subtitle="Run the Vouchley verification engine straight from the dashboard — no code required. Uses your own credits."
        actions={
          balance !== null ? (
            <div className="rounded-lg border border-border bg-canvas px-4 py-2 text-sm">
              <span className="text-ink-muted">Credits</span>{" "}
              <span className="font-semibold text-ink">
                {balance.toLocaleString()}
              </span>
            </div>
          ) : undefined
        }
      />

      <div className="mb-6 inline-flex gap-1 rounded-lg border border-border bg-subtle/60 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-canvas text-ink shadow-sm"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "single" ? (
        <SingleVerify balance={balance} onSpent={refreshBalance} />
      ) : (
        <BulkVerify balance={balance} onBalanceChanged={refreshBalance} />
      )}
    </div>
  );
}

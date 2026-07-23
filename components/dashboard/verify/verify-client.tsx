"use client";

import { useCallback, useEffect, useState } from "react";

import { BulkVerify } from "@/components/dashboard/verify/bulk-verify";
import { SingleVerify } from "@/components/dashboard/verify/single-verify";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchBillingOverview } from "@/lib/api-billing";

export function VerifyClient() {
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

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="single">Single email</TabsTrigger>
          <TabsTrigger value="bulk">Bulk list</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <SingleVerify balance={balance} onSpent={refreshBalance} />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkVerify balance={balance} onBalanceChanged={refreshBalance} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

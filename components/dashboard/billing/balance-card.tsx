"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { type BillingOverview, openCustomerPortal } from "@/lib/api-billing";
import { cn } from "@/lib/utils";

interface Props {
  data: BillingOverview | null;
  loading: boolean;
  onBuyClick: () => void;
}

export function BalanceCard({ data, loading, onBuyClick }: Props) {
  const [portalLoading, setPortalLoading] = useState(false);

  if (loading || !data) {
    return (
      <Card className="border-border/20 p-8 shadow-[var(--shadow-editorial)]">
        <Skeleton className="mb-4 h-5 w-28" />
        <Skeleton className="mb-3 h-12 w-40" />
        <Skeleton className="h-4 w-56" />
      </Card>
    );
  }

  const sub = data.subscription;
  const isActive = sub?.status === "active";

  async function handleManagePlan() {
    if (portalLoading) return;
    setPortalLoading(true);
    try {
      const { url } = await openCustomerPortal();
      window.location.href = url;
    } catch (err) {
      setPortalLoading(false);
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't open customer portal.",
      );
    }
  }

  return (
    <Card className="border-border/20 shadow-[var(--shadow-editorial)]">
      <CardContent className="flex flex-col gap-8 p-8 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  "rounded border-transparent font-mono text-[10px] font-bold uppercase tracking-wider",
                  isActive
                    ? "bg-accent-soft text-accent"
                    : "bg-subtle text-ink-muted",
                )}
              >
                {isActive ? `Active · ${sub!.plan_display_name}` : "Free"}
              </Badge>
              {isActive && sub?.current_period_end && (
                <span className="font-mono text-xs text-ink-muted">
                  Next bill {formatDate(sub.current_period_end)} ·{" "}
                  <span className="text-ink">
                    ${sub.monthly_price_usd.toFixed(0)}/mo
                  </span>
                </span>
              )}
            </div>

            <div className="mt-3 font-serif text-5xl text-ink">
              {data.credits_balance.toLocaleString()}
              <span className="ml-2 font-sans text-base font-medium text-ink-muted">
                credits
              </span>
            </div>

            <p className="mt-2 text-sm text-ink-muted">
              {isActive
                ? `${sub!.monthly_credits.toLocaleString()} credits added each cycle · unused credits roll over`
                : "Subscribe to a plan to get monthly credits"}
            </p>
          </div>

          <div className="text-sm text-ink-muted">
            <span className="font-medium text-ink">
              {data.credits_used_this_month.toLocaleString()}
            </span>{" "}
            credits used this month
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          {isActive ? (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleManagePlan}
              disabled={portalLoading}
            >
              {portalLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
                  Opening portal…
                </>
              ) : (
                <>
                  Manage plan
                  <ExternalLink className="size-4" strokeWidth={1.75} />
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onBuyClick}
            >
              Choose a plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

"use client";

import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { openCustomerPortal } from "@/lib/api-billing";

interface Props {
  hasDodoCustomer: boolean;
  loading: boolean;
}

export function PaymentMethodCard({ hasDodoCustomer, loading }: Props) {
  const [redirecting, setRedirecting] = useState(false);

  async function handleOpenPortal() {
    if (redirecting) return;
    setRedirecting(true);
    try {
      const { url } = await openCustomerPortal();
      window.location.href = url;
    } catch (err) {
      setRedirecting(false);
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't open customer portal. Try again.",
      );
    }
  }

  return (
    <Card className="border-border/20 shadow-[var(--shadow-soft)]">
      <CardContent className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-subtle text-ink-muted">
            <CreditCard className="size-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div>
            {loading ? (
              <>
                <Skeleton className="mb-2 h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <h3 className="mb-1 font-semibold text-ink">
                  {hasDodoCustomer
                    ? "Payment methods & receipts"
                    : "No payment methods on file yet"}
                </h3>
                <p className="text-sm text-ink-muted">
                  {hasDodoCustomer
                    ? "Managed securely through Dodo Payments."
                    : "Purchase your first pack to create a Dodo customer."}
                </p>
              </>
            )}
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleOpenPortal}
          disabled={!hasDodoCustomer || redirecting || loading}
        >
          {redirecting ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
              Opening…
            </>
          ) : (
            <>
              Open customer portal
              <ExternalLink className="size-4" strokeWidth={1.75} />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

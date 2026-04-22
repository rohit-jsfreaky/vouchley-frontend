"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { BalanceCard } from "@/components/dashboard/billing/balance-card";
import { CreditPacks } from "@/components/dashboard/billing/credit-packs";
import { InvoiceHistory } from "@/components/dashboard/billing/invoice-history";
import { PaymentMethodCard } from "@/components/dashboard/billing/payment-method-card";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { ApiError } from "@/lib/api";
import {
  type BillingOverview,
  type InvoiceItem,
  fetchBillingOverview,
  fetchInvoices,
  openCustomerPortal,
} from "@/lib/api-billing";

export function BillingClient() {
  const [overview, setOverview] = useState<BillingOverview | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const packsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const [ov, inv] = await Promise.all([fetchBillingOverview(), fetchInvoices()]);
        if (cancelled) return;
        setOverview(ov);
        setInvoices(inv.items);
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err instanceof ApiError ? err.message : "Couldn't load billing data.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleOpenPortal() {
    try {
      const { url } = await openCustomerPortal();
      window.location.href = url;
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't open customer portal.",
      );
    }
  }

  function scrollToPacks() {
    packsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <PageHeader
        title="Billing"
        subtitle="Manage credits, payment methods, and invoices."
      />

      <div className="space-y-8">
        <BalanceCard
          data={overview}
          loading={loading}
          onBuyClick={scrollToPacks}
        />

        <CreditPacks
          ref={packsRef}
          subscription={overview?.subscription ?? null}
        />

        <PaymentMethodCard
          hasDodoCustomer={overview?.has_dodo_customer ?? false}
          loading={loading}
        />

        <InvoiceHistory
          invoices={invoices}
          loading={loading}
          onOpenPortal={handleOpenPortal}
        />
      </div>
    </div>
  );
}

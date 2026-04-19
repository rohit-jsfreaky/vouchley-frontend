"use client";

import { ExternalLink, Receipt } from "lucide-react";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { InvoiceItem } from "@/lib/api-billing";

interface Props {
  invoices: InvoiceItem[] | null;
  loading: boolean;
  onOpenPortal: () => void;
}

export function InvoiceHistory({ invoices, loading, onOpenPortal }: Props) {
  return (
    <section className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-border/30 p-6">
        <h3 className="font-serif text-2xl text-ink">Purchase history</h3>
      </div>

      {loading ? (
        <InvoiceSkeleton />
      ) : !invoices || invoices.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No purchases yet"
          description="Once you buy your first credit pack, receipts will appear here."
          className="border-0 py-16"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border/30 bg-canvas text-xs font-mono font-semibold uppercase tracking-widest text-ink-muted">
                <th className="px-6 py-3">Invoice #</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Pack</th>
                <th className="px-6 py-3">Credits</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="transition-colors hover:bg-canvas">
                  <td className="px-6 py-4 font-mono text-xs text-ink-muted">
                    {(inv.payment_id ?? inv.id).slice(0, 14)}…
                  </td>
                  <td className="px-6 py-4 text-ink">
                    {formatDate(inv.created_at)}
                  </td>
                  <td className="px-6 py-4 text-ink">{inv.pack_name}</td>
                  <td className="px-6 py-4 font-mono text-ink-muted">
                    +{inv.credits_added.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-mono text-ink">
                    ${inv.amount_usd.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded bg-accent-soft px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={onOpenPortal}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-hover"
                      title="Open receipt in Dodo portal"
                    >
                      Receipt
                      <ExternalLink className="size-3" strokeWidth={1.75} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function InvoiceSkeleton() {
  return (
    <div className="divide-y divide-border/30">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-7 items-center gap-6 px-6 py-4"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="ml-auto h-4 w-14" />
        </div>
      ))}
    </div>
  );
}

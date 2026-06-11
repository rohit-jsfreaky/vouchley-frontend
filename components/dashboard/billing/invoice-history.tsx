"use client";

import { ExternalLink, Receipt } from "lucide-react";

import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { PaidBadge } from "@/components/dashboard/shared/status-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InvoiceItem } from "@/lib/api-billing";

interface Props {
  invoices: InvoiceItem[] | null;
  loading: boolean;
  onOpenPortal: () => void;
}

export function InvoiceHistory({ invoices, loading, onOpenPortal }: Props) {
  return (
    <Card className="gap-0 overflow-hidden border-border/20 py-0 shadow-[var(--shadow-soft)]">
      <CardHeader className="border-b border-border py-4">
        <CardTitle className="text-lg font-semibold text-ink">
          Purchase history
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
          <Table className="[&_td]:px-5 [&_td]:py-3 [&_th]:h-11 [&_th]:px-5">
            <TableHeader>
              <TableRow className="border-border bg-subtle/40 hover:bg-subtle/40 [&_th]:text-[13px] [&_th]:font-medium [&_th]:text-ink-muted">
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Pack</TableHead>
                <TableHead className="text-right">Credits</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right" aria-label="Actions" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow
                  key={inv.id}
                  className="border-border/60 transition-colors hover:bg-subtle/40"
                >
                  <TableCell>
                    <span className="rounded-md border border-border/60 bg-subtle px-2 py-1 font-mono text-xs text-ink-muted">
                      {(inv.payment_id ?? inv.id).slice(0, 14)}…
                    </span>
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    {formatDate(inv.created_at)}
                  </TableCell>
                  <TableCell className="font-medium text-ink">
                    {inv.pack_name}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium text-accent">
                    +{inv.credits_added.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-ink">
                    ${inv.amount_usd.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <PaidBadge />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onOpenPortal}
                      title="Open receipt in Dodo portal"
                      className="text-brand hover:text-brand-hover"
                    >
                      Receipt
                      <ExternalLink className="size-3" strokeWidth={1.75} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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

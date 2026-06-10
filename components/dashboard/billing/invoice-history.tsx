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
      <CardHeader className="border-b border-border/30 bg-subtle/60 py-4">
        <CardTitle className="font-serif text-2xl font-normal text-ink">
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
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Pack</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs text-ink-muted">
                    {(inv.payment_id ?? inv.id).slice(0, 14)}…
                  </TableCell>
                  <TableCell className="text-ink">
                    {formatDate(inv.created_at)}
                  </TableCell>
                  <TableCell className="text-ink">{inv.pack_name}</TableCell>
                  <TableCell className="font-mono text-ink-muted">
                    +{inv.credits_added.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-ink">
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

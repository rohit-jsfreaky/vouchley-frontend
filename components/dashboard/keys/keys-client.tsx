"use client";

import { Info, KeyRound, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CreateKeyModal } from "@/components/dashboard/keys/create-key-modal";
import { KeyRevealModal } from "@/components/dashboard/keys/key-reveal-modal";
import { KeyStatusBadge } from "@/components/dashboard/shared/status-badges";
import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/lib/api";
import {
  type ApiKeyItem,
  fetchApiKeys,
  revokeApiKey,
} from "@/lib/api-dashboard";
import { cn } from "@/lib/utils";

export function ApiKeysClient() {
  const [keys, setKeys] = useState<ApiKeyItem[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [revealing, setRevealing] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [confirmingKey, setConfirmingKey] = useState<ApiKeyItem | null>(null);

  async function reload() {
    try {
      const res = await fetchApiKeys();
      setKeys(res.keys);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't load keys.");
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleRevoke(key: ApiKeyItem) {
    if (key.revoked_at) return;
    setConfirmingKey(key);
  }

  async function confirmRevoke() {
    if (!confirmingKey) return;
    setRevokingId(confirmingKey.id);
    try {
      await revokeApiKey(confirmingKey.id);
      toast.success("Key revoked.");
      setConfirmingKey(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't revoke.");
    } finally {
      setRevokingId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="API Keys"
        subtitle="Credentials your servers use to call the Vouchley API."
        actions={
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setCreating(true)}
            className="cursor-pointer gap-2"
          >
            <Plus className="size-4" strokeWidth={2.25} />
            Create key
          </Button>
        }
      />

      <p className="mb-6 flex items-center gap-2 text-[13px] text-ink-muted">
        <Info className="size-3.5 shrink-0 text-ink-soft" strokeWidth={1.75} />
        Keys are shown in full exactly once, at creation. Lost one? Create a
        replacement and revoke the old key.
      </p>

      {keys === null ? (
        <KeysTableSkeleton />
      ) : keys.length === 0 ? (
        <EmptyState
          icon={KeyRound}
          title="No API keys yet"
          description="Create your first key to start calling the Vouchley API. You'll see the plaintext value exactly once — copy it into your server env immediately."
          className="py-20"
        />
      ) : (
        <KeysTable
          keys={keys}
          onRevoke={handleRevoke}
          revokingId={revokingId}
        />
      )}

      <CreateKeyModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={(res) => {
          setCreating(false);
          setRevealing(res.plaintext);
          reload();
        }}
      />
      {revealing && (
        <KeyRevealModal
          plaintext={revealing}
          onDone={() => setRevealing(null)}
        />
      )}

      <AlertDialog
        open={!!confirmingKey}
        onOpenChange={(o) => {
          if (!o && revokingId === null) setConfirmingKey(null);
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold tracking-tight text-ink">
              Revoke API key?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-ink-muted">
              {confirmingKey
                ? `Revoking "${confirmingKey.label || confirmingKey.key_prefix}" will immediately break any app still using it.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="rounded-xl border border-warning/30 bg-warning-bg/40 p-4 text-sm text-ink-muted">
            This action cannot be undone. If you need uninterrupted access, create and
            deploy a replacement key before revoking this one.
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              variant="secondary"
              size="md"
              disabled={revokingId !== null}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="primary"
              size="md"
              onClick={(e) => {
                e.preventDefault();
                confirmRevoke();
              }}
              disabled={revokingId !== null}
              className="cursor-pointer"
            >
              {revokingId !== null ? "Revoking…" : "Yes, revoke key"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function KeysTable({
  keys,
  onRevoke,
  revokingId,
}: {
  keys: ApiKeyItem[];
  onRevoke: (k: ApiKeyItem) => void;
  revokingId: string | null;
}) {
  return (
    <Card className="overflow-hidden border-border/20 p-0 shadow-[var(--shadow-soft)]">
      <Table className="[&_td]:px-5 [&_td]:py-3 [&_th]:h-11 [&_th]:px-5">
        <TableHeader>
          <TableRow className="border-border bg-subtle/40 hover:bg-subtle/40 [&_th]:text-[13px] [&_th]:font-medium [&_th]:text-ink-muted">
            <TableHead>Key</TableHead>
            <TableHead>Prefix</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right" aria-label="Actions" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((k) => {
            const revoked = !!k.revoked_at;
            return (
              <TableRow
                key={k.id}
                className={cn(
                  "group border-border/60 transition-colors hover:bg-subtle/40",
                  revoked && "opacity-60",
                )}
              >
                <TableCell className="max-w-[240px]">
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg",
                        revoked
                          ? "bg-subtle text-ink-soft"
                          : "bg-brand-soft text-brand",
                      )}
                    >
                      <KeyRound className="size-3.5" strokeWidth={1.75} />
                    </span>
                    <span
                      className={cn(
                        "truncate font-medium text-ink",
                        revoked && "text-ink-muted",
                      )}
                    >
                      {k.label || (
                        <span className="font-normal text-ink-soft">
                          Untitled key
                        </span>
                      )}
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="rounded-md border border-border/60 bg-subtle px-2 py-1 font-mono text-xs text-ink-muted">
                    {k.key_prefix}…
                  </span>
                </TableCell>
                <TableCell className="text-ink-muted">
                  {formatDate(k.created_at)}
                </TableCell>
                <TableCell className="text-ink-muted">
                  {k.last_used_at ? (
                    relativeTime(k.last_used_at)
                  ) : (
                    <span className="text-ink-soft">Never</span>
                  )}
                </TableCell>
                <TableCell>
                  <KeyStatusBadge revoked={revoked} environment={k.environment} />
                </TableCell>
                <TableCell className="text-right">
                  {!revoked && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRevoke(k)}
                      disabled={revokingId === k.id}
                      aria-label={`Revoke ${k.label || k.key_prefix}`}
                      className="cursor-pointer text-ink-soft opacity-0 transition-opacity hover:bg-danger-bg hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.75} />
                      {revokingId === k.id ? "Revoking…" : "Revoke"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

function KeysTableSkeleton() {
  return (
    <Card className="overflow-hidden border-border/20 p-0 shadow-[var(--shadow-soft)]">
      <div className="border-b border-border/30 bg-subtle/60 px-4 py-4">
        <Skeleton className="h-4 w-40" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-6 items-center gap-6 border-b border-border/30 px-4 py-5 last:border-0"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-28 rounded" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mx-auto h-5 w-16 rounded" />
          <Skeleton className="ml-auto h-5 w-12 rounded" />
        </div>
      ))}
    </Card>
  );
}

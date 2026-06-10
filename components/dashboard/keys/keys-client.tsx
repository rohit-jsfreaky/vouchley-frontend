"use client";

import { Info, KeyRound, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CreateKeyModal } from "@/components/dashboard/keys/create-key-modal";
import { KeyRevealModal } from "@/components/dashboard/keys/key-reveal-modal";
import { KeyStatusBadge } from "@/components/dashboard/shared/status-badges";
import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
        subtitle="Manage your application access credentials."
        actions={
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setCreating(true)}
            className="cursor-pointer"
          >
            Create new key
          </Button>
        }
      />

      <Alert className="mb-10 border-info/30 bg-info-bg/40">
        <Info className="text-info" strokeWidth={1.75} />
        <AlertTitle className="text-ink">Security Notice</AlertTitle>
        <AlertDescription className="text-ink-muted">
          For your protection, API keys are only displayed once upon creation. If
          you lose a key, you&apos;ll need to rotate it or create a new one.
        </AlertDescription>
      </Alert>

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
            <AlertDialogTitle className="font-serif text-2xl font-normal text-ink">
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
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Label</TableHead>
            <TableHead>Prefix</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last used</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((k) => {
            const revoked = !!k.revoked_at;
            return (
              <TableRow key={k.id} className="group">
                <TableCell
                  className={cn("font-medium", revoked && "text-ink-muted")}
                >
                  {k.label || <span className="text-ink-soft">(no label)</span>}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "rounded border border-border/50 bg-muted px-2 py-1 font-mono text-xs text-ink-muted",
                      revoked && "opacity-60",
                    )}
                  >
                    {k.key_prefix}…
                  </span>
                </TableCell>
                <TableCell className="text-ink-muted">
                  {formatDate(k.created_at)}
                </TableCell>
                <TableCell className="text-ink-muted">
                  {k.last_used_at ? relativeTime(k.last_used_at) : "Never"}
                </TableCell>
                <TableCell className="text-center">
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
                      className="cursor-pointer text-danger hover:bg-danger-bg hover:text-danger"
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

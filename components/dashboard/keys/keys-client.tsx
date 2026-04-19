"use client";

import { Info, KeyRound, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CreateKeyModal } from "@/components/dashboard/keys/create-key-modal";
import { KeyRevealModal } from "@/components/dashboard/keys/key-reveal-modal";
import { EmptyState } from "@/components/dashboard/shell/empty-state";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
    const confirm = window.confirm(
      `Revoke "${key.label || key.key_prefix}"? Any app still using it will start failing.`,
    );
    if (!confirm) return;
    setRevokingId(key.id);
    try {
      await revokeApiKey(key.id);
      toast.success("Key revoked.");
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
          >
            Create new key
          </Button>
        }
      />

      <div className="mb-10 flex items-start gap-4 rounded-xl border border-info/30 bg-info-bg/40 p-5">
        <Info className="mt-0.5 size-5 shrink-0 text-info" strokeWidth={1.75} />
        <div>
          <h4 className="mb-1 text-sm font-semibold text-ink">Security Notice</h4>
          <p className="text-sm text-ink-muted">
            For your protection, API keys are only displayed once upon creation. If
            you lose a key, you&apos;ll need to rotate it or create a new one.
          </p>
        </div>
      </div>

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
    <section className="overflow-hidden rounded-2xl border border-border/20 bg-subtle/60 shadow-[var(--shadow-editorial)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-border/30 bg-muted/60 text-ink-muted">
              <th className="px-6 py-4 font-semibold">Label</th>
              <th className="px-6 py-4 font-semibold">Prefix</th>
              <th className="px-6 py-4 font-semibold">Created</th>
              <th className="px-6 py-4 font-semibold">Last used</th>
              <th className="px-6 py-4 text-center font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 bg-surface text-ink">
            {keys.map((k) => {
              const revoked = !!k.revoked_at;
              return (
                <tr key={k.id} className="group transition-colors hover:bg-canvas">
                  <td
                    className={cn(
                      "px-6 py-5 font-medium",
                      revoked && "text-ink-muted",
                    )}
                  >
                    {k.label || <span className="text-ink-soft">(no label)</span>}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={cn(
                        "rounded border border-border/50 bg-muted px-2 py-1 font-mono text-xs text-ink-muted",
                        revoked && "opacity-60",
                      )}
                    >
                      {k.key_prefix}…
                    </span>
                  </td>
                  <td className="px-6 py-5 text-ink-muted">
                    {formatDate(k.created_at)}
                  </td>
                  <td className="px-6 py-5 text-ink-muted">
                    {k.last_used_at ? relativeTime(k.last_used_at) : "Never"}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <StatusPill revoked={revoked} environment={k.environment} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    {!revoked && (
                      <button
                        type="button"
                        onClick={() => onRevoke(k)}
                        disabled={revokingId === k.id}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger-bg disabled:opacity-60"
                      >
                        <Trash2 className="size-3.5" strokeWidth={1.75} />
                        {revokingId === k.id ? "Revoking…" : "Revoke"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusPill({
  revoked,
  environment,
}: {
  revoked: boolean;
  environment: string;
}) {
  if (revoked) {
    return (
      <span className="inline-flex items-center rounded bg-muted px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted">
        Revoked
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider",
        environment === "test"
          ? "bg-info-bg text-info"
          : "bg-accent-soft text-accent",
      )}
    >
      {environment === "test" ? "Test" : "Active"}
    </span>
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
    <section className="overflow-hidden rounded-2xl border border-border/20 bg-subtle/60 shadow-[var(--shadow-editorial)]">
      <div className="border-b border-border/30 bg-muted/60 px-6 py-4">
        <Skeleton className="h-4 w-40" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-6 items-center gap-6 border-b border-border/30 bg-surface px-6 py-5"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-28 rounded" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mx-auto h-5 w-16 rounded" />
          <Skeleton className="ml-auto h-5 w-12 rounded" />
        </div>
      ))}
    </section>
  );
}

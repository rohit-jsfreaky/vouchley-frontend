"use client";

import { Check, Copy, ShieldAlert } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface Props {
  plaintext: string;
  onDone: () => void;
}

export function KeyRevealModal({ plaintext, onDone }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(plaintext);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <Modal
      open
      onClose={onDone}
      title="Key created successfully"
      description="Please copy this key now. For your security, it will not be shown again."
      size="md"
      align="center"
      bodyClassName="text-center"
    >
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Check className="size-8" strokeWidth={2.5} aria-hidden />
      </div>

      <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-canvas p-4 text-left">
        <code className="flex-1 break-all font-mono text-sm text-ink">
          {plaintext}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="flex-shrink-0 cursor-pointer rounded-lg border border-border bg-surface p-2 text-brand transition-colors hover:bg-subtle"
          aria-label="Copy key"
        >
          {copied ? (
            <Check className="size-5 text-accent" strokeWidth={2.5} />
          ) : (
            <Copy className="size-5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning-bg/40 p-4 text-left text-sm text-ink-muted">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={1.75} />
        <span>
          Store this key in your server&apos;s environment variables. Never commit
          it to version control or paste it into client-side code.
        </span>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="md"
        onClick={onDone}
        className="w-full cursor-pointer"
      >
        I&apos;ve copied it — close
      </Button>
    </Modal>
  );
}

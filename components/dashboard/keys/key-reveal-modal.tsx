"use client";

import { Check, Copy, ShieldAlert } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <Dialog
      open
      onOpenChange={(o) => {
        if (!o) onDone();
      }}
    >
      <DialogContent className="text-center">
        <DialogHeader className="items-center">
          <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Check className="size-8" strokeWidth={2.5} aria-hidden />
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-ink">
            Key created successfully
          </DialogTitle>
          <DialogDescription className="text-ink-muted">
            Please copy this key now. For your security, it will not be shown again.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-canvas p-4 text-left">
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

        <Alert className="border-warning/30 bg-warning-bg/40 text-left">
          <ShieldAlert className="text-warning" strokeWidth={1.75} />
          <AlertDescription className="text-ink-muted">
            Store this key in your server&apos;s environment variables. Never commit
            it to version control or paste it into client-side code.
          </AlertDescription>
        </Alert>

        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onDone}
          className="w-full cursor-pointer"
        >
          I&apos;ve copied it — close
        </Button>
      </DialogContent>
    </Dialog>
  );
}

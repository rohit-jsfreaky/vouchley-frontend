"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail in insecure contexts or if user denies.
      // Silent — the visible copy button is a convenience, not load-bearing.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "rounded-md p-1.5 text-ink-soft transition-colors hover:bg-subtle hover:text-brand",
        className,
      )}
    >
      {copied ? (
        <Check className="size-4 text-accent" strokeWidth={2.5} />
      ) : (
        <Copy className="size-4" strokeWidth={1.75} />
      )}
    </button>
  );
}

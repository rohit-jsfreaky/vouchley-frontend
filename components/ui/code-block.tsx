import { codeToHtml } from "shiki";

import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

/**
 * Server-rendered syntax-highlighted code block.
 *
 * Uses shiki with `github-light` — clean, readable, matches our warm palette.
 * Ships ZERO JavaScript; shiki runs at render time and emits plain HTML.
 *
 * Variants:
 *   - `terminal`  = full chrome (traffic lights + filename bar), used in hero
 *   - `doc`       = muted grey block, used inline in docs
 *   - `inline`    = bare pre, no chrome — for small one-liners
 */
export type CodeBlockVariant = "terminal" | "doc" | "inline";

export interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
  variant?: CodeBlockVariant;
  showCopy?: boolean;
  className?: string;
}

const SHIKI_THEME = "github-light";

export async function CodeBlock({
  code,
  lang = "bash",
  filename,
  variant = "doc",
  showCopy = true,
  className,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: SHIKI_THEME,
  });

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "shiki-wrapper overflow-x-auto rounded-md bg-subtle p-3 font-mono text-sm",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (variant === "terminal") {
    return (
      <div
        className={cn(
          "shiki-wrapper relative rounded-xl border border-border/50 bg-surface p-6 shadow-[var(--shadow-editorial)]",
          className,
        )}
      >
        <div className="mb-4 flex items-center border-b border-subtle pb-3">
          <div className="flex gap-2">
            <span className="size-3 rounded-full bg-danger-bg" />
            <span className="size-3 rounded-full bg-warning-bg" />
            <span className="size-3 rounded-full bg-accent-soft" />
          </div>
          {filename && (
            <span className="ml-4 font-mono text-xs text-ink-soft">
              {filename}
            </span>
          )}
          {showCopy && (
            <div className="ml-auto">
              <CopyButton value={code} />
            </div>
          )}
        </div>
        <div
          className="overflow-x-auto font-mono text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  // variant === "doc"
  return (
    <div
      className={cn(
        "shiki-wrapper group relative overflow-hidden rounded-lg border border-border/40 bg-subtle/70",
        className,
      )}
    >
      {(filename || showCopy) && (
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
          {filename ? (
            <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">
              {filename}
            </span>
          ) : (
            <span />
          )}
          {showCopy && <CopyButton value={code} />}
        </div>
      )}
      <div
        className="overflow-x-auto p-4 font-mono text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

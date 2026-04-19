import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  cta,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/50 bg-canvas/50 px-6 py-12 text-center",
        className,
      )}
    >
      {Icon && (
        <Icon
          className="size-8 text-ink-soft"
          strokeWidth={1.5}
          aria-hidden
        />
      )}
      <h3 className="font-serif text-xl text-ink">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      )}
      {cta && (
        <Link
          href={cta.href}
          className={cn(
            buttonStyles({ variant: "primary", size: "md" }),
            "mt-3",
          )}
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}

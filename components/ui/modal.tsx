"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useId } from "react";

import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg";
type ModalAlign = "left" | "center";

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  align?: ModalAlign;
  dismissible?: boolean;
  className?: string;
  bodyClassName?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  align = "left",
  dismissible = true,
  className,
  bodyClassName,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && dismissible) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dismissible, onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 p-4">
      <div
        className="absolute inset-0 bg-ink/35 backdrop-blur-sm transition-opacity duration-200"
        onClick={dismissible ? onClose : undefined}
        aria-hidden="true"
      />

      <div className="relative flex min-h-full items-center justify-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            "relative w-full rounded-2xl border border-border/30 bg-surface p-8 shadow-[var(--shadow-editorial)]",
            SIZE_CLASS[size],
            className,
          )}
          onClick={(event) => event.stopPropagation()}
        >
          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
              aria-label="Close modal"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          )}

          {(title || description) && (
            <header className={cn("mb-6 pr-10", align === "center" && "text-center")}>
              {title && (
                <h2 id={titleId} className="font-serif text-3xl text-ink">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descriptionId} className="mt-2 text-sm text-ink-muted">
                  {description}
                </p>
              )}
            </header>
          )}

          <div className={bodyClassName}>{children}</div>

          {footer && (
            <footer className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

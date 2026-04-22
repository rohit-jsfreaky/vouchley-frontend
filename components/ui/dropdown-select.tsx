"use client";

import { ChevronDown, Check } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  disabled?: boolean;
  className?: string;
}

export function DropdownSelect<T extends string>({
  value,
  onChange,
  options,
  disabled,
  className,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 min-w-[180px] cursor-pointer items-center justify-between gap-4 rounded-lg border border-border/40 bg-surface px-4 text-sm font-semibold text-ink shadow-[var(--shadow-soft)] transition-all duration-200 ease-out hover:border-border-strong hover:bg-canvas focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft disabled:cursor-not-allowed disabled:opacity-60",
          open && "border-brand bg-canvas shadow-[var(--shadow-editorial)]",
        )}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-muted transition-transform duration-200",
            open && "rotate-180",
          )}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          "absolute right-0 top-[calc(100%+0.5rem)] z-30 w-full origin-top rounded-xl border border-border/40 bg-surface p-1.5 shadow-[var(--shadow-editorial)] transition-all duration-200 ease-out",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0",
        )}
      >
        <div id={listboxId} role="listbox" aria-activedescendant={`${listboxId}-${value}`}>
          {options.map((option) => {
            const selectedOption = option.value === value;
            return (
              <button
                key={option.value}
                id={`${listboxId}-${option.value}`}
                type="button"
                role="option"
                aria-selected={selectedOption}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  selectedOption
                    ? "bg-brand-soft text-brand"
                    : "text-ink hover:bg-subtle",
                )}
              >
                <span>{option.label}</span>
                <Check
                  className={cn(
                    "size-4 transition-opacity",
                    selectedOption ? "opacity-100" : "opacity-0",
                  )}
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

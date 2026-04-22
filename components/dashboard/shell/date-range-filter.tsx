"use client";

import { format, subDays } from "date-fns";
import { CalendarDays, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";

import { buttonStyles } from "@/components/ui/button";
import type { DashboardDateRange } from "@/lib/api-dashboard";
import { cn } from "@/lib/utils";

const DEFAULT_RANGE = {
  from: subDays(new Date(), 6),
  to: new Date(),
} satisfies DateRange;

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function toRangeValue(range: DateRange): DashboardDateRange {
  return {
    startDate: format(startOfDay(range.from!), "yyyy-MM-dd"),
    endDate: format(startOfDay(range.to!), "yyyy-MM-dd"),
  };
}

function labelForRange(range: DateRange) {
  if (!range.from || !range.to) return "Select range";
  return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d")}`;
}

export function DashboardDateRangeFilter({
  value,
  onChange,
  disabled,
}: {
  value: DashboardDateRange;
  onChange: (value: DashboardDateRange) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>({
    from: new Date(`${value.startDate}T00:00:00`),
    to: new Date(`${value.endDate}T00:00:00`),
  });
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDraft({
      from: new Date(`${value.startDate}T00:00:00`),
      to: new Date(`${value.endDate}T00:00:00`),
    });
  }, [value.endDate, value.startDate]);

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
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 min-w-[196px] cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/40 bg-surface px-4 text-sm font-semibold text-ink shadow-[var(--shadow-soft)] transition-all duration-200 ease-out hover:border-border-strong hover:bg-canvas focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft disabled:cursor-not-allowed disabled:opacity-60",
          open && "border-brand bg-canvas shadow-[var(--shadow-editorial)]",
        )}
      >
        <span className="truncate">{labelForRange(draft)}</span>
        <CalendarDays className="size-4 shrink-0 text-ink-muted" strokeWidth={1.75} />
      </button>

      <div
        className={cn(
          "absolute right-0 top-[calc(100%+0.5rem)] z-30 w-[min(92vw,720px)] origin-top rounded-2xl border border-border/40 bg-surface p-4 shadow-[var(--shadow-editorial)] transition-all duration-200 ease-out",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Dashboard range
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Pick a date span for the overview cards and charts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-subtle hover:text-brand"
            aria-label="Close date picker"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="rounded-xl bg-canvas/70 p-3">
          <DayPicker
            mode="range"
            selected={draft}
            onSelect={(range) => {
              if (!range) return;
              setDraft(range);
            }}
            defaultMonth={draft.from}
            numberOfMonths={2}
            showOutsideDays
            disabled={{ after: new Date() }}
            className="rdp-vouchley"
            classNames={{
              months: "flex flex-col gap-6 lg:flex-row",
              month: "space-y-4",
              month_caption: "flex items-center justify-between px-1",
              caption_label: "font-serif text-xl text-ink",
              nav: "flex items-center gap-2",
              button_previous:
                "inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border/40 bg-surface text-ink transition-colors hover:bg-subtle",
              button_next:
                "inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border/40 bg-surface text-ink transition-colors hover:bg-subtle",
              month_grid: "w-full border-separate border-spacing-y-1",
              weekdays: "grid grid-cols-7 gap-1",
              weekday:
                "font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft",
              week: "grid grid-cols-7 gap-1",
              day: "h-10 w-10",
              day_button:
                "flex size-10 cursor-pointer items-center justify-center rounded-lg text-sm text-ink transition-colors hover:bg-subtle",
              range_start: "rounded-lg bg-brand text-ink-inverse hover:bg-brand",
              range_end: "rounded-lg bg-brand text-ink-inverse hover:bg-brand",
              range_middle: "rounded-lg bg-brand-soft text-brand hover:bg-brand-soft",
              selected: "rounded-lg bg-brand text-ink-inverse hover:bg-brand",
              today: "font-semibold text-brand",
              outside: "text-ink-soft/40",
              disabled: "cursor-not-allowed text-ink-soft/30 hover:bg-transparent",
            }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              const fallback = { ...DEFAULT_RANGE };
              setDraft(fallback);
              onChange(toRangeValue(fallback));
              setOpen(false);
            }}
            className={buttonStyles({
              variant: "secondary",
              size: "md",
              className: "cursor-pointer",
            })}
          >
            Clear to last 7 days
          </button>

          <button
            type="button"
            disabled={!draft.from || !draft.to}
            onClick={() => {
              if (!draft.from || !draft.to) return;
              onChange(toRangeValue(draft));
              setOpen(false);
            }}
            className={buttonStyles({
              variant: "primary",
              size: "md",
              className: "cursor-pointer",
            })}
          >
            Apply range
          </button>
        </div>
      </div>
    </div>
  );
}

export function defaultDashboardRange(): DashboardDateRange {
  return toRangeValue(DEFAULT_RANGE);
}

"use client";

import { format, subDays } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DashboardDateRange } from "@/lib/api-dashboard";

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

function label(range: DateRange | undefined) {
  if (!range?.from) return "Pick a range";
  if (!range.to) return format(range.from, "MMM d, yyyy");
  return `${format(range.from, "MMM d")} – ${format(range.to, "MMM d")}`;
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
  const [draft, setDraft] = useState<DateRange | undefined>({
    from: new Date(`${value.startDate}T00:00:00`),
    to: new Date(`${value.endDate}T00:00:00`),
  });

  useEffect(() => {
    setDraft({
      from: new Date(`${value.startDate}T00:00:00`),
      to: new Date(`${value.endDate}T00:00:00`),
    });
  }, [value.endDate, value.startDate]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="md"
          disabled={disabled}
          className="min-w-[200px] justify-start gap-2 border border-border bg-surface font-medium text-ink hover:bg-subtle"
        >
          <CalendarDays className="size-4 text-ink-muted" strokeWidth={1.75} />
          {label(draft)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          defaultMonth={draft?.from ?? DEFAULT_RANGE.from}
          selected={draft}
          onSelect={(range) => {
            setDraft(range);
            if (range?.from && range?.to) {
              onChange(toRangeValue(range));
              setOpen(false);
            }
          }}
          numberOfMonths={2}
          showOutsideDays
          disabled={{ after: new Date() }}
        />
      </PopoverContent>
    </Popover>
  );
}

export function defaultDashboardRange(): DashboardDateRange {
  return toRangeValue(DEFAULT_RANGE);
}

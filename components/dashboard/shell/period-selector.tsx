"use client";

import { ChevronDown } from "lucide-react";

import type { Period } from "@/lib/api-dashboard";

const OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "mtd", label: "Month to date" },
  { value: "all", label: "All time" },
];

export function PeriodSelector({
  value,
  onChange,
  options = OPTIONS,
  disabled,
}: {
  value: Period;
  onChange: (v: Period) => void;
  options?: { value: Period; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Period)}
        disabled={disabled}
        className="appearance-none rounded-lg border border-border/40 bg-surface py-2 pl-4 pr-10 text-sm font-semibold text-ink shadow-[var(--shadow-soft)] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft disabled:opacity-60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
        strokeWidth={1.75}
        aria-hidden
      />
    </div>
  );
}

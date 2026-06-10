"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  disabled,
}: {
  value: Period;
  onChange: (value: Period) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as Period)}
      disabled={disabled}
    >
      <SelectTrigger className="h-11 min-w-[180px] bg-surface font-semibold shadow-[var(--shadow-soft)]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import { DropdownSelect, type DropdownOption } from "@/components/ui/dropdown-select";
import type { Period } from "@/lib/api-dashboard";

export function PeriodSelector({
  value,
  onChange,
  disabled,
}: {
  value: Period;
  onChange: (value: Period) => void;
  disabled?: boolean;
}) {
  const options: DropdownOption<Period>[] = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "mtd", label: "Month to date" },
    { value: "all", label: "All time" },
  ];

  return (
    <DropdownSelect value={value} onChange={onChange} options={options} disabled={disabled} />
  );
}

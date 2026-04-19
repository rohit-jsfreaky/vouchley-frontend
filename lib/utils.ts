import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class strings, deduping conflicts (later wins).
 * Use everywhere className is conditional.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

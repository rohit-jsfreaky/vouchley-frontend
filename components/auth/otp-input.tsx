"use client";

import { ClipboardEvent, KeyboardEvent, useRef } from "react";

import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
  autoFocus,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function setAt(idx: number, raw: string) {
    const only = raw.replace(/\D/g, "").slice(0, 1);
    const chars = digits.slice();
    chars[idx] = only;
    const next = chars.join("").slice(0, length);
    onChange(next);
    if (only && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
  }

  function handleKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      e.preventDefault();
      const chars = digits.slice();
      chars[idx - 1] = "";
      onChange(chars.join(""));
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    const last = Math.min(pasted.length, length - 1);
    refs.current[last]?.focus();
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digits[i]}
          onChange={(e) => setAt(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            "size-12 rounded-lg border border-border bg-canvas text-center font-mono text-xl text-ink transition-colors",
            "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />
      ))}
    </div>
  );
}

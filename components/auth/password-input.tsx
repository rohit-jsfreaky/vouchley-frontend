"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, InputHTMLAttributes, useState } from "react";

import { cn } from "@/lib/utils";

export type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const Icon = visible ? EyeOff : Eye;

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          className={cn(
            "w-full rounded-lg border border-border bg-canvas px-4 py-2.5 pr-11 text-[15px] text-ink placeholder:text-ink-soft transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft disabled:opacity-60",
            className,
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-soft transition-colors hover:text-ink disabled:pointer-events-none"
        >
          <Icon className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

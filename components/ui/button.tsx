import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-ink-inverse shadow-[0_4px_14px_0_rgba(184,96,60,0.2)] hover:bg-brand-hover hover:shadow-[0_6px_20px_rgba(184,96,60,0.28)]",
  secondary:
    "bg-transparent border border-border text-ink hover:bg-subtle",
  ghost:
    "bg-transparent text-ink-muted hover:text-brand",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
};

export function buttonStyles(options?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { variant = "primary", size = "md", className } = options ?? {};
  return cn(BASE, VARIANT[variant], SIZE[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  ),
);
Button.displayName = "Button";

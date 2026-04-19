import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div
        className={cn(
          "rounded-xl border border-border/30 bg-surface p-8 shadow-[var(--shadow-soft)]",
          className,
        )}
      >
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl text-ink">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
      {footer && (
        <p className="text-center text-sm text-ink-muted">{footer}</p>
      )}
    </div>
  );
}

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-ink-soft">
      <span className="h-px flex-1 bg-border" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

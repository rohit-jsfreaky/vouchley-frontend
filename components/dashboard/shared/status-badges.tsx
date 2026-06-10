import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Shared status pills for the dashboard, built on shadcn `Badge` with the
 * editorial tone palette (olive = good, terracotta-red = bad, muted = neutral).
 * Used across Overview, Keys, Checks, and Billing so every status looks the
 * same everywhere.
 */

const TONE: Record<"good" | "bad" | "neutral" | "info", string> = {
  good: "border-transparent bg-accent-soft text-accent",
  bad: "border-transparent bg-danger-bg text-danger",
  neutral: "border-transparent bg-muted text-ink-muted",
  info: "border-transparent bg-info-bg text-info",
};

function ToneBadge({
  tone,
  className,
  children,
}: {
  tone: keyof typeof TONE;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Badge
      className={cn(
        "rounded font-mono text-[10px] font-bold uppercase tracking-wider",
        TONE[tone],
        className,
      )}
    >
      {children}
    </Badge>
  );
}

export function RecommendationBadge({
  value,
  className,
}: {
  value: string | null;
  className?: string;
}) {
  const tone: keyof typeof TONE =
    value === "approve"
      ? "good"
      : value === "block"
        ? "bad"
        : value === "review"
          ? "neutral"
          : "neutral";
  return (
    <ToneBadge tone={tone} className={className}>
      {(value || "—").toUpperCase()}
    </ToneBadge>
  );
}

export function KeyStatusBadge({
  revoked,
  environment,
}: {
  revoked: boolean;
  environment: string;
}) {
  if (revoked) return <ToneBadge tone="neutral">Revoked</ToneBadge>;
  if (environment === "test") return <ToneBadge tone="info">Test</ToneBadge>;
  return <ToneBadge tone="good">Active</ToneBadge>;
}

export function SignalBadge({
  label,
  tone,
}: {
  label: string;
  tone: "good" | "bad" | "neutral";
}) {
  return <ToneBadge tone={tone}>{label}</ToneBadge>;
}

export function PaidBadge() {
  return <ToneBadge tone="good">Paid</ToneBadge>;
}

/** Score value with editorial coloring: ≥70 olive, 40–69 muted, <40 terracotta. */
export function ScoreValue({
  score,
  className,
}: {
  score: number | null;
  className?: string;
}) {
  if (score === null) return <span className="text-ink-soft">—</span>;
  const tone =
    score >= 70 ? "text-accent" : score >= 40 ? "text-ink-muted" : "text-danger";
  return (
    <span className={cn("font-semibold tabular-nums", tone, className)}>
      {score}
    </span>
  );
}

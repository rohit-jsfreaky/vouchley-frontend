import { TICKER_EVENTS, type TickerEvent } from "@/config/home";
import { cn } from "@/lib/utils";

const VERDICT_STYLE: Record<TickerEvent["verdict"], string> = {
  approve: "bg-accent-soft text-accent",
  review: "bg-warning-bg text-warning",
  block: "bg-danger-bg text-danger",
};

/**
 * Horizontal marquee of verification events — gives the page a "live
 * product" pulse. Pure CSS animation (pauses on hover, disabled for
 * reduced-motion users). List is duplicated so the -50% translate loops
 * seamlessly.
 */
export function VerificationTicker() {
  const doubled = [...TICKER_EVENTS, ...TICKER_EVENTS];

  return (
    <section
      aria-hidden
      className="marquee-group relative overflow-hidden border-y border-border bg-surface py-4"
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface to-transparent" />

      <div className="animate-marquee flex w-max items-center gap-3">
        {doubled.map((event, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-full border border-border bg-canvas py-1.5 pl-4 pr-1.5"
          >
            <span className="font-mono text-xs text-ink-muted">
              {event.email}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                VERDICT_STYLE[event.verdict],
              )}
            >
              {event.verdict}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

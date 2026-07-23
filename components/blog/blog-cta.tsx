import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

/**
 * Conversion CTA shown on every blog post — as a sticky sidebar on desktop and
 * inline after the article on mobile. Blog posts are our top organic landing
 * pages but had no conversion path; this is it.
 */
export function BlogCta() {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand/20 bg-surface shadow-[var(--shadow-soft)]">
      <div className="bg-brand-soft/50 px-5 pt-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand">
          Signup Verification API
        </p>
        <h3 className="mt-1 font-sans text-lg font-bold leading-snug tracking-tight text-ink">
          Stop fake signups in one API call
        </h3>
      </div>

      <div className="px-5 py-5">
        <p className="text-sm leading-relaxed text-ink-muted">
          Vouchley scores every signup — email, disposable, VPN, proxy, and bot
          risk — and returns approve, review, or block. One call, about 200ms.
        </p>

        <ul className="mt-4 space-y-2">
          {[
            "100 free credits, no card",
            "From $19/mo for 15,000 checks",
            "Ship it in an afternoon",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-ink">
              <Check className="size-4 shrink-0 text-accent" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href="/signup"
          className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          Get 100 free credits
          <ArrowRight className="size-4" strokeWidth={2.25} />
        </Link>
        <Link
          href="/docs/api/verify"
          className="mt-2 flex w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand"
        >
          Read the docs
        </Link>

        <p className="mt-4 border-t border-border/60 pt-3 text-center text-xs text-ink-muted">
          Just checking one address?{" "}
          <Link
            href="/tools/disposable-email-checker"
            className="font-medium text-brand hover:underline"
          >
            Free email checker →
          </Link>
        </p>
      </div>
    </div>
  );
}

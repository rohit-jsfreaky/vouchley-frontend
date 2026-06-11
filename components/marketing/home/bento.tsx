import { Code2, Gauge, Layers, Lock } from "lucide-react";

import { Reveal } from "@/components/marketing/animation/reveal";

const SIGNALS = [
  "Email & MX",
  "Domain age",
  "IP reputation",
  "VPN / Tor",
  "Datacenter ASN",
  "Bot patterns",
];

export function Bento() {
  return (
    <section className="px-6 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Why Vouchley
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            The fastest way to stop fake signups.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-muted">
            One call sits between your signup form and your database. Everything
            you need to make a decision comes back in a single response.
          </p>
        </Reveal>

        <Reveal stagger={0.1} className="grid gap-4 lg:grid-cols-6">
          {/* Wide: trust score */}
          <article className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow-soft)] lg:col-span-4">
            <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Gauge className="size-5" strokeWidth={1.75} />
            </div>
            <h3 className="text-xl font-semibold text-ink">
              A 0–100 trust score, plus a clear verdict
            </h3>
            <p className="mt-2 max-w-md leading-relaxed text-ink-muted">
              Every signup comes back with a score, a recommendation — approve,
              review, or block — and a plain-English reason. No raw signal
              soup to interpret yourself.
            </p>

            {/* Mini score visual */}
            <div className="mt-7 flex items-center gap-4 rounded-2xl border border-border bg-canvas p-4">
              <span className="text-4xl font-semibold tabular-nums tracking-tight text-ink">
                86
              </span>
              <div className="flex-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-2 w-[86%] rounded-full bg-accent" />
                </div>
                <p className="mt-2 font-mono text-xs text-ink-muted">
                  sarah.chen@stripe.com
                </p>
              </div>
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                approve
              </span>
            </div>
          </article>

          {/* Latency */}
          <article className="group rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow-soft)] lg:col-span-2">
            <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Gauge className="size-5" strokeWidth={1.75} />
            </div>
            <h3 className="text-xl font-semibold text-ink">Sub-second</h3>
            <p className="mt-2 leading-relaxed text-ink-muted">
              Cache hits in under 100ms. Fresh checks run every signal in
              parallel — under 1.5s at the p95.
            </p>
          </article>

          {/* Dark: six signals */}
          <article className="group relative overflow-hidden rounded-3xl border border-[#262a33] bg-[#0e1016] p-8 lg:col-span-2">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-brand/25 blur-3xl"
            />
            <div className="relative">
              <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-white/10 text-white">
                <Layers className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Six signals, one call
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Run in parallel on every request.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {SIGNALS.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/80"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* Drop-in code */}
          <article className="group rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow-soft)] lg:col-span-2">
            <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Code2 className="size-5" strokeWidth={1.75} />
            </div>
            <h3 className="text-xl font-semibold text-ink">Drop-in integration</h3>
            <p className="mt-2 leading-relaxed text-ink-muted">
              One endpoint, Bearer auth, JSON in and out. Live in under five
              minutes — no SDK required.
            </p>
            <pre className="mt-5 overflow-x-auto rounded-xl border border-border bg-canvas px-3.5 py-3 font-mono text-[11.5px] leading-5 text-ink-muted">
              <span className="text-brand">POST</span> /v1/verify
            </pre>
          </article>

          {/* Private */}
          <article className="group rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow-soft)] lg:col-span-2">
            <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Lock className="size-5" strokeWidth={1.75} />
            </div>
            <h3 className="text-xl font-semibold text-ink">Private by default</h3>
            <p className="mt-2 leading-relaxed text-ink-muted">
              We score signups, not identities. Your data is never sold, shared,
              or used for training. EU residency on Pro.
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/marketing/animation/reveal";
import { HOW_IT_WORKS } from "@/config/home";

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-surface px-6 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            How it works
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            One API call between
            <br />
            signup and database.
          </h2>
        </Reveal>

        <Reveal
          as="ol"
          stagger={0.14}
          className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8"
        >
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step.step} className="relative">
              {/* Connector line (desktop) */}
              {i < HOW_IT_WORKS.length - 1 && (
                <div
                  aria-hidden
                  className="absolute left-14 right-0 top-6 hidden h-px bg-gradient-to-r from-border-strong to-transparent md:block"
                />
              )}
              <div className="relative mb-6 inline-flex size-12 items-center justify-center rounded-full border border-brand/25 bg-brand-soft font-mono text-sm font-semibold text-brand">
                {step.step}
              </div>
              <h3 className="mb-2.5 text-xl font-semibold text-ink">
                {step.title}
              </h3>
              <p className="leading-relaxed text-ink-muted">{step.body}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

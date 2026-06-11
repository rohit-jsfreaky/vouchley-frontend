import { Reveal } from "@/components/marketing/animation/reveal";
import { FOUNDER } from "@/config/home";

export function Founder() {
  return (
    <section className="border-y border-border bg-surface px-6 py-20 md:px-8 md:py-24">
      <Reveal className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-white">
            R
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Built by
          </p>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            {FOUNDER.heading}
          </h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-muted">
            {FOUNDER.body}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

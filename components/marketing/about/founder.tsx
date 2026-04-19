import { FOUNDER } from "@/config/about";

export function AboutFounder() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-8">
      <h2 className="mb-12 inline-block border-b border-border pb-4 font-serif text-4xl text-ink">
        The Founder
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <article className="rounded-xl border border-border/30 bg-surface p-8 transition-colors duration-200 hover:bg-canvas md:col-span-1">
          <div
            className="mb-6 flex size-24 items-center justify-center rounded-full bg-brand-soft font-serif text-4xl text-brand"
            aria-hidden
          >
            {FOUNDER.initials}
          </div>
          <h3 className="mb-2 font-serif text-2xl text-ink">{FOUNDER.name}</h3>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-brand">
            {FOUNDER.role}
          </p>
          <p className="text-sm leading-relaxed text-ink-muted">
            {FOUNDER.bio}
          </p>
        </article>
      </div>
    </section>
  );
}

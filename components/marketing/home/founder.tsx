import { FOUNDER } from "@/config/home";

export function Founder() {
  return (
    <section className="bg-subtle/60 px-6 py-20 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-brand">
          Built by
        </p>
        <h2 className="mb-6 font-serif text-3xl text-ink md:text-4xl">
          {FOUNDER.heading}
        </h2>
        <p className="mx-auto max-w-2xl leading-relaxed text-ink-muted">
          {FOUNDER.body}
        </p>
      </div>
    </section>
  );
}

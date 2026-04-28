import { WHAT_WE_DETECT } from "@/config/home";

export function WhatWeDetect() {
  return (
    <section className="bg-subtle/60 px-6 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-brand">
            What we detect
          </p>
          <h2 className="font-serif text-4xl text-ink md:text-5xl">
            Six fraud signals,
            <br />
            one trust score.
          </h2>
          <p className="mt-6 leading-relaxed text-ink-muted">
            Each verify call runs the full stack in parallel. You get a single
            decision plus the breakdown of every signal that fired — useful for
            tuning, debugging, and explaining a block to support.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {WHAT_WE_DETECT.map((item) => (
            <li key={item.title} className="bg-surface p-8">
              <h3 className="mb-3 font-serif text-xl text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

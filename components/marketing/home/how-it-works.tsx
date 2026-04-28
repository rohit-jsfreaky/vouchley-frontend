import { HOW_IT_WORKS } from "@/config/home";

export function HowItWorks() {
  return (
    <section className="bg-canvas px-6 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-brand">
            How it works
          </p>
          <h2 className="font-serif text-4xl text-ink md:text-5xl">
            One API call between
            <br />
            signup and database.
          </h2>
        </div>
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <li
              key={step.step}
              className="rounded-xl border border-border bg-surface p-8"
            >
              <div className="mb-5 font-mono text-sm tracking-wider text-brand">
                {step.step}
              </div>
              <h3 className="mb-3 font-serif text-2xl text-ink">{step.title}</h3>
              <p className="leading-relaxed text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

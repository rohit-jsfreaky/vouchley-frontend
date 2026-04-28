import { FAQ } from "@/config/home";

export function Faq() {
  return (
    <section className="bg-canvas px-6 py-24 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-brand">
            FAQ
          </p>
          <h2 className="font-serif text-4xl text-ink md:text-5xl">
            Frequently asked
            <br />
            questions.
          </h2>
        </div>
        <dl className="divide-y divide-border border-y border-border">
          {FAQ.map((item) => (
            <details
              key={item.question}
              className="group py-6"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <dt className="font-serif text-lg text-ink md:text-xl">
                  {item.question}
                </dt>
                <span
                  aria-hidden
                  className="mt-1 select-none font-mono text-xl text-brand transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <dd className="mt-4 leading-relaxed text-ink-muted">
                {item.answer}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}

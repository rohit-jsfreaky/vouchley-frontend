import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import type { Comparison } from "@/config/comparisons";

export function ComparisonPage({ data }: { data: Comparison }) {
  return (
    <>
      <Hero data={data} />
      <Verdict data={data} />
      <FeatureTable data={data} />
      <Pricing data={data} />
      <Honest data={data} />
      <Faqs data={data} />
      <FinalCta data={data} />
    </>
  );
}

// ---------------------------------------------------------------------------
function Hero({ data }: { data: Comparison }) {
  return (
    <section className="bg-canvas px-6 py-24 md:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-brand">
          Comparison · {data.category}
        </p>
        <h1 className="font-serif text-5xl text-ink md:text-6xl">
          Vouchley vs {data.name}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-ink-muted">
          {data.pitch}
        </p>
        <p className="mt-4 leading-relaxed text-ink-muted">{data.heroBody}</p>
        <p className="mt-6 text-xs text-ink-soft">
          Last verified against{" "}
          <a
            href={data.url}
            rel="nofollow noopener"
            target="_blank"
            className="underline decoration-dotted underline-offset-2 hover:text-ink"
          >
            {data.name}&rsquo;s public pages
          </a>{" "}
          on {data.lastVerified}.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Verdict({ data }: { data: Comparison }) {
  return (
    <section className="bg-subtle/60 px-6 py-20 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 font-serif text-3xl text-ink md:text-4xl">
          Quick verdict
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-brand/40 bg-surface p-8">
            <h3 className="mb-4 font-serif text-xl text-ink">
              Pick Vouchley if&hellip;
            </h3>
            <ul className="space-y-3 text-ink-muted">
              {data.verdict.pickVouchleyIf.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <span aria-hidden className="mt-1 text-brand">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-surface p-8">
            <h3 className="mb-4 font-serif text-xl text-ink">
              Pick {data.name} if&hellip;
            </h3>
            <ul className="space-y-3 text-ink-muted">
              {data.verdict.pickCompetitorIf.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <span aria-hidden className="mt-1 text-ink-soft">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function FeatureTable({ data }: { data: Comparison }) {
  return (
    <section className="bg-canvas px-6 py-20 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 font-serif text-3xl text-ink md:text-4xl">
          Side-by-side features
        </h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-subtle/60 text-left text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Feature</th>
                <th className="px-6 py-4 font-medium">Vouchley</th>
                <th className="px-6 py-4 font-medium">{data.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.features.map((row) => (
                <tr key={row.feature} className="bg-surface">
                  <td className="px-6 py-4 align-top font-medium text-ink">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 align-top text-ink-muted">
                    {row.vouchley}
                  </td>
                  <td className="px-6 py-4 align-top text-ink-muted">
                    {row.competitor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Pricing({ data }: { data: Comparison }) {
  return (
    <section className="bg-subtle/60 px-6 py-20 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 font-serif text-3xl text-ink md:text-4xl">
          Pricing, side by side
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-brand/40 bg-surface p-8">
            <h3 className="mb-3 font-serif text-xl text-ink">Vouchley</h3>
            <p className="leading-relaxed text-ink-muted">
              {data.pricing.vouchleySummary}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-8">
            <h3 className="mb-3 font-serif text-xl text-ink">{data.name}</h3>
            <p className="leading-relaxed text-ink-muted">
              {data.pricing.competitorSummary}
            </p>
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-border bg-surface p-8">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-brand">
            Sample scenario
          </p>
          <p className="mb-4 font-serif text-xl text-ink">
            {data.pricing.sampleScenario.label}
          </p>
          <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="text-ink-soft">Vouchley</dt>
              <dd className="mt-1 text-ink">
                {data.pricing.sampleScenario.vouchleyCost}
              </dd>
            </div>
            <div>
              <dt className="text-ink-soft">{data.name}</dt>
              <dd className="mt-1 text-ink">
                {data.pricing.sampleScenario.competitorCost}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Honest({ data }: { data: Comparison }) {
  return (
    <section className="bg-canvas px-6 py-20 md:px-8">
      <div className="mx-auto max-w-3xl space-y-12">
        <div>
          <h2 className="mb-5 font-serif text-3xl text-ink md:text-4xl">
            When {data.name} is the better pick
          </h2>
          <p className="leading-relaxed text-ink-muted">
            {data.whenCompetitorWins}
          </p>
        </div>
        <div>
          <h2 className="mb-5 font-serif text-3xl text-ink md:text-4xl">
            When Vouchley is the better pick
          </h2>
          <p className="leading-relaxed text-ink-muted">
            {data.whenVouchleyWins}
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Faqs({ data }: { data: Comparison }) {
  return (
    <section className="bg-subtle/60 px-6 py-20 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 font-serif text-3xl text-ink md:text-4xl">
          Frequently asked
        </h2>
        <dl className="divide-y divide-border border-y border-border">
          {data.faqs.map((item) => (
            <details key={item.question} className="group py-6">
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

// ---------------------------------------------------------------------------
function FinalCta({ data }: { data: Comparison }) {
  return (
    <section className="bg-canvas px-6 py-24 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-6 font-serif text-4xl text-ink md:text-5xl">
          Try Vouchley before {data.name}.
        </h2>
        <p className="mb-10 leading-relaxed text-ink-muted">
          100 free credits, no card required. If we&rsquo;re not the right fit,
          you&rsquo;ll know in five minutes — no sales call needed.
        </p>
        <div className="flex justify-center">
          <Link
            href="/signup"
            className={buttonStyles({ variant: "primary", size: "lg" })}
          >
            Start free
          </Link>
        </div>
      </div>
    </section>
  );
}

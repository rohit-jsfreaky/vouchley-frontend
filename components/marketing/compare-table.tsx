import Link from "next/link";

import { Reveal } from "@/components/marketing/animation/reveal";
import { COMPARE_TABLE } from "@/config/compare-table";

/**
 * Shared "How we compare" table — used on both `/` and `/pricing`.
 * Vouchley row is highlighted; competitor rows link to deep-dive
 * comparison pages where one exists.
 */
export function CompareTable() {
  const { title, subtitle, vouchley, competitors, footnote } = COMPARE_TABLE;

  return (
    <section className="border-y border-border bg-surface px-6 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            How we stack up
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink-muted">
            {subtitle}
          </p>
        </Reveal>

        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-subtle/70 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">
                  <tr>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Checks per call</th>
                    <th className="px-6 py-4">10K verifications</th>
                    <th className="px-6 py-4">Credits expire?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {/* Vouchley row — highlighted */}
                  <tr className="bg-brand-soft/50">
                    <td className="px-6 py-5 align-top">
                      <span className="inline-flex items-center gap-2 text-base font-semibold text-brand">
                        {vouchley.name}
                        <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Us
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top font-medium text-ink">
                      {vouchley.checks}
                    </td>
                    <td className="px-6 py-5 align-top font-semibold text-ink">
                      {vouchley.cost10k}
                    </td>
                    <td className="px-6 py-5 align-top">
                      <ExpiryCell value={vouchley.expiry} tone={vouchley.expiryTone} />
                    </td>
                  </tr>
                  {competitors.map((c) => (
                    <tr
                      key={c.name}
                      className="transition-colors hover:bg-subtle/40"
                    >
                      <td className="px-6 py-5 align-top">
                        {c.versusSlug ? (
                          <Link
                            href={`/vs/${c.versusSlug}`}
                            className="font-medium text-ink underline-offset-4 hover:text-brand hover:underline"
                          >
                            {c.name}
                            <span aria-hidden className="ml-1.5 text-xs text-ink-soft">
                              ↗
                            </span>
                          </Link>
                        ) : (
                          <span className="font-medium text-ink">{c.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-5 align-top text-ink-muted">
                        {c.checks}
                      </td>
                      <td className="px-6 py-5 align-top text-ink-muted">
                        {c.cost10k}
                      </td>
                      <td className="px-6 py-5 align-top">
                        <ExpiryCell value={c.expiry} tone={c.expiryTone} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-ink-soft">
            {footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ExpiryCell({
  value,
  tone,
}: {
  value: string;
  tone: "good" | "warn" | "bad";
}) {
  const style =
    tone === "good"
      ? "bg-accent-soft text-accent"
      : tone === "warn"
        ? "bg-warning-bg text-warning"
        : "bg-danger-bg text-danger";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {value}
    </span>
  );
}

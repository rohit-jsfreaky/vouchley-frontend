import Link from "next/link";

import { COMPARE_TABLE } from "@/config/compare-table";

/**
 * Shared "How we compare" table — used on both `/` and `/pricing`.
 * Vouchley row is highlighted; competitor rows link to deep-dive
 * comparison pages where one exists.
 */
export function CompareTable() {
  const { title, subtitle, vouchley, competitors, footnote } = COMPARE_TABLE;

  return (
    <section className="bg-canvas px-6 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-brand">
            How we stack up
          </p>
          <h2 className="font-serif text-4xl text-ink md:text-5xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink-muted">
            {subtitle}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-subtle/60 text-left text-xs uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Checks per call</th>
                  <th className="px-6 py-4 font-medium">10K verifications</th>
                  <th className="px-6 py-4 font-medium">Credits expire?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {/* Vouchley row — highlighted */}
                <tr className="bg-brand/8">
                  <td className="px-6 py-5 align-top">
                    <span className="font-serif text-lg text-brand">
                      {vouchley.name}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-top text-ink">
                    {vouchley.checks}
                  </td>
                  <td className="px-6 py-5 align-top font-medium text-ink">
                    {vouchley.cost10k}
                  </td>
                  <td className="px-6 py-5 align-top">
                    <ExpiryCell value={vouchley.expiry} tone={vouchley.expiryTone} />
                  </td>
                </tr>
                {competitors.map((c) => (
                  <tr key={c.name}>
                    <td className="px-6 py-5 align-top">
                      {c.versusSlug ? (
                        <Link
                          href={`/vs/${c.versusSlug}`}
                          className="font-medium text-ink hover:text-brand"
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
  const color =
    tone === "good"
      ? "text-emerald-700"
      : tone === "warn"
      ? "text-amber-700"
      : "text-rose-700";
  return <span className={`font-medium ${color}`}>{value}</span>;
}

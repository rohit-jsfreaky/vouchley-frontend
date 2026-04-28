import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import {
  type DisposableDomain,
  getRelatedDomains,
} from "@/config/disposable-domains";

export function DomainPage({ data }: { data: DisposableDomain }) {
  const isDisposable = data.kind === "disposable";
  const related = getRelatedDomains(data.related);

  return (
    <>
      <Hero data={data} isDisposable={isDisposable} />
      <Verdict data={data} isDisposable={isDisposable} />
      <About data={data} />
      <BlockGuide data={data} isDisposable={isDisposable} />
      <CodeExample data={data} />
      <Related related={related} />
      <Cta />
    </>
  );
}

// ---------------------------------------------------------------------------
function Hero({
  data,
  isDisposable,
}: {
  data: DisposableDomain;
  isDisposable: boolean;
}) {
  return (
    <section className="bg-canvas px-6 py-20 md:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-brand">
          Disposable email database
        </p>
        <h1 className="font-serif text-4xl text-ink md:text-5xl">
          Is{" "}
          <span className="font-mono text-3xl md:text-4xl">{data.domain}</span>{" "}
          a disposable email?
        </h1>
        <div
          className={`mt-8 inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm font-medium ${
            isDisposable
              ? "bg-brand/10 text-brand"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          <span aria-hidden>{isDisposable ? "⚠" : "✓"}</span>
          {isDisposable
            ? `Yes — ${data.domain} is a disposable / temporary email service.`
            : `No — ${data.domain} is a legitimate free email provider.`}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Verdict({
  data,
  isDisposable,
}: {
  data: DisposableDomain;
  isDisposable: boolean;
}) {
  return (
    <section className="bg-subtle/60 px-6 py-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-border bg-surface p-8">
          <h2 className="mb-3 font-serif text-2xl text-ink">Quick answer</h2>
          <p className="leading-relaxed text-ink-muted">
            {isDisposable ? (
              <>
                <strong className="text-ink">{data.domain}</strong> is operated
                by <strong className="text-ink">{data.serviceName}</strong>, a
                disposable / temporary email service. Signups using this domain
                are almost always throwaway. <strong className="text-ink">Block at signup</strong>{" "}
                if your product depends on long-term email reachability.
              </>
            ) : (
              <>
                <strong className="text-ink">{data.domain}</strong> is operated
                by <strong className="text-ink">{data.serviceName}</strong>, a
                legitimate free email provider. <strong className="text-ink">Do not block</strong>{" "}
                — these users are real and represent a large fraction of healthy
                B2C and small-business signups.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function About({ data }: { data: DisposableDomain }) {
  return (
    <section className="bg-canvas px-6 py-16 md:px-8">
      <div className="mx-auto max-w-3xl space-y-10">
        <div>
          <h2 className="mb-4 font-serif text-3xl text-ink">
            About {data.serviceName}
          </h2>
          <p className="leading-relaxed text-ink-muted">{data.description}</p>
          {data.launchYear && (
            <p className="mt-4 text-sm text-ink-soft">
              Operating since {data.launchYear}.
            </p>
          )}
        </div>
        <div>
          <h2 className="mb-4 font-serif text-3xl text-ink">
            What it&rsquo;s typically used for
          </h2>
          <p className="leading-relaxed text-ink-muted">{data.typicalUse}</p>
        </div>
        {data.aliases && data.aliases.length > 0 && (
          <div>
            <h2 className="mb-4 font-serif text-3xl text-ink">
              Other domains operated by {data.serviceName}
            </h2>
            <p className="mb-3 leading-relaxed text-ink-muted">
              The same service runs additional alias domains. Block these
              alongside the main domain — otherwise users will simply switch to
              an alias to bypass your filter.
            </p>
            <ul className="grid grid-cols-2 gap-2 font-mono text-sm md:grid-cols-3">
              {data.aliases.map((alias) => (
                <li
                  key={alias}
                  className="rounded-md border border-border bg-subtle/50 px-3 py-2 text-ink-muted"
                >
                  {alias}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function BlockGuide({
  data,
  isDisposable,
}: {
  data: DisposableDomain;
  isDisposable: boolean;
}) {
  return (
    <section className="bg-subtle/60 px-6 py-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 font-serif text-3xl text-ink">
          Should you block {data.domain} in your signup form?
        </h2>
        <p className="leading-relaxed text-ink-muted">{data.blockRationale}</p>
        {!isDisposable && (
          <p className="mt-4 leading-relaxed text-ink-muted">
            What you{" "}
            <em>
              should
            </em>{" "}
            do for {data.serviceName} signups: score them through your normal
            verification flow, watch for the same alias tricks (dot-variations,
            <code className="mx-1 rounded bg-subtle px-1 py-0.5 font-mono text-xs">
              +
            </code>
            tags), and keep the same disposable + IP checks running.
          </p>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function CodeExample({ data }: { data: DisposableDomain }) {
  return (
    <section className="bg-canvas px-6 py-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 font-serif text-3xl text-ink">
          How to detect {data.domain} in code
        </h2>
        <p className="mb-6 leading-relaxed text-ink-muted">
          You don&rsquo;t need to maintain a hand-rolled list. Vouchley returns
          a <code className="rounded bg-subtle px-1.5 py-0.5 font-mono text-xs">
            disposable
          </code>{" "}
          flag (and the rest of the signup score) on every check:
        </p>
        <pre className="overflow-x-auto rounded-xl border border-border bg-ink p-6 text-sm leading-relaxed text-canvas">
          <code>{`curl -X POST https://api.vouchley.getrevlio.com/v1/verify \\
  -H "Authorization: Bearer vch_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "anyone@${data.domain}",
    "ip_address": "203.0.113.10"
  }'

# Response:
# {
#   "score": ${data.kind === "disposable" ? "12" : "78"},
#   "recommendation": "${data.kind === "disposable" ? "block" : "approve"}",
#   "email": { "disposable": ${data.kind === "disposable" ? "true" : "false"}, "valid": true },
#   ...
# }`}</code>
        </pre>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Related({ related }: { related: ReturnType<typeof getRelatedDomains> }) {
  if (related.length === 0) return null;
  return (
    <section className="bg-subtle/60 px-6 py-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 font-serif text-3xl text-ink">Related services</h2>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {related.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/disposable-emails/${d.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 transition-shadow hover:shadow-[var(--shadow-soft)]"
              >
                <div>
                  <div className="font-mono text-sm text-ink">{d.domain}</div>
                  <div className="text-xs text-ink-soft">{d.serviceName}</div>
                </div>
                <span
                  aria-hidden
                  className="text-brand transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Cta() {
  return (
    <section className="bg-canvas px-6 py-20 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 font-serif text-3xl text-ink md:text-4xl">
          Block disposable signups in one API call.
        </h2>
        <p className="mb-8 leading-relaxed text-ink-muted">
          Vouchley keeps the disposable list current — including alias domains
          and new providers — so you never have to maintain it yourself.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className={buttonStyles({ variant: "primary", size: "lg" })}
          >
            Start free — 100 credits
          </Link>
          <Link
            href="/disposable-emails"
            className={buttonStyles({ variant: "ghost", size: "lg" })}
          >
            Browse all domains
          </Link>
        </div>
      </div>
    </section>
  );
}

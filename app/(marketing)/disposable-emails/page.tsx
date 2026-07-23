import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { buttonStyles } from "@/components/ui/button";
import { DISPOSABLE_DOMAINS } from "@/config/disposable-domains";
import { SITE } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Disposable Email Domains: 2026 List to Block",
  description:
    "Curated list of well-known disposable, temporary, and free email providers. Each entry shows whether to block the domain at signup and why.",
  path: "/disposable-emails",
  keywords: [
    "disposable email domains",
    "list of disposable email providers",
    "block disposable emails",
    "temporary email services",
    "throwaway email list",
  ],
});

export default function DisposableEmailsIndexPage() {
  const disposable = DISPOSABLE_DOMAINS.filter((d) => d.kind === "disposable");
  const free = DISPOSABLE_DOMAINS.filter((d) => d.kind === "free_provider");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Disposable emails", url: `${SITE.url}/disposable-emails` },
        ])}
      />
      <section className="bg-canvas px-6 py-20 md:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-brand">
            Disposable email database
          </p>
          <h1 className="mb-6 font-serif text-5xl text-ink md:text-6xl">
            Disposable email domain reference.
          </h1>
          <p className="text-lg leading-relaxed text-ink-muted">
            Curated guide to the best-known disposable, temporary, and
            throwaway email services on the public web. Each page explains who
            operates the domain, what the service offers, and whether to block
            it at signup. The full live blocklist used by the Vouchley API
            covers thousands more — these pages cover the providers people
            most often look up by name.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            Looking for a specific domain? Check the list below or hit the API
            directly — Vouchley returns a{" "}
            <code className="rounded bg-subtle px-1.5 py-0.5 font-mono text-xs">
              disposable
            </code>{" "}
            flag on every verification.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border border-border/40 bg-surface p-5">
            <div className="flex-1 min-w-[200px]">
              <div className="mb-1 font-serif text-lg text-ink">
                Free download — disposable domain list (JSON)
              </div>
              <p className="text-sm text-ink-muted">
                Curated 20 services plus the full 5,000+ raw blocklist. Free to
                use, no email required.
              </p>
            </div>
            <a
              href="/disposable-domains.json"
              download="vouchley-disposable-domains.json"
              className={buttonStyles({ variant: "secondary", size: "md" })}
            >
              Download JSON
            </a>
          </div>
        </div>
      </section>

      <Section
        title="Disposable & temporary email services"
        items={disposable}
      />
      <Section
        title="Free email providers (not disposable)"
        items={free}
        subtitle="These are legitimate free webmail services. Do not block — they are listed here because users frequently search whether they are disposable."
      />

      <section className="bg-canvas px-6 py-20 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-3xl text-ink md:text-4xl">
            Don&rsquo;t maintain this list yourself.
          </h2>
          <p className="mb-8 leading-relaxed text-ink-muted">
            New disposable domains spawn every week. Vouchley keeps the live
            list current and returns the disposable verdict alongside IP, VPN,
            and behavioural signals — in a single API call.
          </p>
          <Link
            href="/signup"
            className={buttonStyles({ variant: "primary", size: "lg" })}
          >
            Start free — 100 credits
          </Link>
        </div>
      </section>
    </>
  );
}

function Section({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: typeof DISPOSABLE_DOMAINS;
}) {
  return (
    <section className="bg-subtle/60 px-6 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 font-serif text-3xl text-ink md:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mb-8 leading-relaxed text-ink-muted">{subtitle}</p>
        )}
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/disposable-emails/${d.slug}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface px-5 py-4 transition-shadow hover:shadow-[var(--shadow-soft)]"
              >
                <div className="font-mono text-sm text-ink">{d.domain}</div>
                <div className="mt-1 text-xs text-ink-soft">
                  {d.serviceName}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

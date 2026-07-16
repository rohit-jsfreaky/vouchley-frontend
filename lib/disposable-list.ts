/**
 * Loads the published disposable-domain list (public/disposable-domains.json)
 * into fast lookup structures. Used by the free /tools/disposable-email-checker
 * API route — no external API call, no credits, so the tool can never be abused
 * to drain the paid quota.
 */
import raw from "../public/disposable-domains.json";

type Curated = {
  domain: string;
  service: string;
  kind: string;
  block: boolean;
  aliases?: string[];
};

const data = raw as unknown as {
  curated: Curated[];
  all_disposable_domains: string[];
};

const disposableSet = new Set<string>(
  data.all_disposable_domains.map((d) => d.toLowerCase()),
);
const serviceByDomain = new Map<string, string>();

for (const c of data.curated) {
  const domain = c.domain.toLowerCase();
  disposableSet.add(domain);
  serviceByDomain.set(domain, c.service);
  for (const alias of c.aliases ?? []) {
    const a = alias.toLowerCase();
    disposableSet.add(a);
    serviceByDomain.set(a, c.service);
  }
}

export const DISPOSABLE_DOMAIN_COUNT = disposableSet.size;

export function lookupDisposable(domain: string): {
  disposable: boolean;
  service: string | null;
} {
  const d = domain.toLowerCase();
  return { disposable: disposableSet.has(d), service: serviceByDomain.get(d) ?? null };
}

/** Well-known legitimate free providers — not disposable, but worth flagging. */
export const FREE_PROVIDERS = new Set<string>([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "gmx.com",
  "gmx.net",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "tutanota.com",
]);

/** Role-based local parts that rarely belong to one real human. */
export const ROLE_LOCAL_PARTS = new Set<string>([
  "info",
  "admin",
  "support",
  "sales",
  "contact",
  "hello",
  "team",
  "billing",
  "help",
  "office",
  "marketing",
  "noreply",
  "no-reply",
  "webmaster",
  "postmaster",
  "abuse",
  "root",
]);

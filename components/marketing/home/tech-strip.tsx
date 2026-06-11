import { Reveal } from "@/components/marketing/animation/reveal";

/**
 * Honest stand-in for a logo cloud: Vouchley is a single HTTP endpoint, so any
 * language can call it. We show languages, not customer logos we don't have.
 */
const LANGUAGES = [
  "cURL",
  "Node.js",
  "Python",
  "Go",
  "Ruby",
  "PHP",
  "Rust",
  "Java",
];

export function TechStrip() {
  return (
    <section className="px-6 py-16 md:px-8 md:py-20">
      <Reveal className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-medium text-ink-muted">
          One HTTP endpoint. Call it from anything you already ship.
        </p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {LANGUAGES.map((lang) => (
            <li
              key={lang}
              className="text-lg font-semibold tracking-tight text-ink-soft transition-colors duration-200 hover:text-ink"
            >
              {lang}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

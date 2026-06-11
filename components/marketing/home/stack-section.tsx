import Link from "next/link";

import { Reveal } from "@/components/marketing/animation/reveal";

const STACKS = [
  "Next.js",
  "Express",
  "Django",
  "FastAPI",
  "Rails",
  "Laravel",
  "Spring",
  "Go net/http",
  "Supabase",
  "Clerk",
  "Auth.js",
  "WorkOS",
];

/**
 * Dark contrast band (Arcade's "integrated with the tools you rely on"),
 * adapted honestly: Vouchley is plain HTTP, so it drops into whatever auth
 * stack you already run — no plugin marketplace implied.
 */
export function StackSection() {
  return (
    <section className="px-6 py-24 md:px-8 md:py-28">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#23262f] bg-[#0c0d10] px-8 py-16 text-center md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Drops into the stack you already run.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/60">
              Vouchley is plain HTTP — no plugin to install, no framework lock-in.
              Call it from your signup handler, gate the account, done.
            </p>

            <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
              {STACKS.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/80 transition-colors duration-200 hover:border-white/25 hover:text-white"
                >
                  {s}
                </li>
              ))}
            </ul>

            <Link
              href="/docs"
              className="mt-10 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#0c0d10] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              Read the integration docs
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

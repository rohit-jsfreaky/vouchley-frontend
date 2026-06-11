import Link from "next/link";

import { Reveal } from "@/components/marketing/animation/reveal";
import { FINAL_CTA } from "@/config/home";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/auth-client";

export function FinalCta({ user }: { user: User | null }) {
  return (
    <section className="px-6 py-24 md:px-8 md:py-28">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-brand px-8 py-20 text-center md:px-16 md:py-24">
          {/* Subtle texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:56px_56px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-28 left-1/2 h-72 w-[560px] -translate-x-1/2 rounded-full bg-white/15 blur-[100px]"
          />

          <div className="relative">
            <h2 className="mx-auto mb-5 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              {FINAL_CTA.title}
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              {FINAL_CTA.subtitle}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={user ? "/dashboard" : FINAL_CTA.primaryCta.href}
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-brand shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]",
                )}
              >
                {user ? "Go to dashboard" : FINAL_CTA.primaryCta.label}
              </Link>
              <Link
                href="/docs"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-8 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

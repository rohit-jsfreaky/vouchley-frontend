import Link from "next/link";

import { HeroCodeSnippet } from "@/components/marketing/home/code-snippet";
import { buttonStyles } from "@/components/ui/button";
import { HERO } from "@/config/home";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-canvas to-subtle px-6 pb-24 pt-16 md:px-8">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="z-10">
          <h1 className="mb-6 font-serif text-5xl leading-[1.1] tracking-tight text-ink md:text-7xl">
            {HERO.headline}{" "}
            <span className="italic text-brand">{HERO.headlineAccent}</span>
          </h1>
          <p className="mb-10 max-w-xl text-[17px] leading-relaxed text-ink-muted md:text-[19px]">
            {HERO.subheadline}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href={HERO.primaryCta.href}
              className={buttonStyles({ variant: "primary", size: "lg" })}
            >
              {HERO.primaryCta.label}
            </Link>
            <Link
              href={HERO.secondaryCta.href}
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              {HERO.secondaryCta.label}
            </Link>
          </div>
        </div>

        <HeroCodeSnippet />
      </div>
    </section>
  );
}

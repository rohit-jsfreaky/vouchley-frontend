"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { HeroEmailCheck } from "@/components/marketing/home/hero-email-check";
import { PlatformShowcase } from "@/components/marketing/home/platform-showcase";
import { buttonStyles } from "@/components/ui/button";
import { HERO } from "@/config/home";
import type { User } from "@/lib/auth-client";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Arcade-style hero: a soft mesh-gradient banner with rounded bottom corners,
 * centered headline + CTAs, and the live product card straddling the fade into
 * the page. Mesh stays light so dark ink text reads cleanly.
 */
const MESH: React.CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 50% 26%, rgba(255,255,255,0.72) 0, transparent 52%)",
    "radial-gradient(circle at 16% 22%, #5b82ff 0, transparent 40%)",
    "radial-gradient(circle at 84% 16%, #9c8bff 0, transparent 40%)",
    "radial-gradient(circle at 72% 46%, #58c9ff 0, transparent 42%)",
    "radial-gradient(circle at 92% 64%, #ff9ec9 0, transparent 36%)",
    "linear-gradient(180deg, #d6e3ff 0%, #e8eeff 58%, var(--color-canvas) 100%)",
  ].join(", "),
};

export function Hero({ user }: { user: User | null }) {
  const scope = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-badge]",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55 },
      )
        .fromTo(
          "[data-hero-word]",
          { autoAlpha: 0, y: 30, rotateX: -24 },
          { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.7, stagger: 0.06 },
          "-=0.25",
        )
        .fromTo(
          "[data-hero-sub]",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          "-=0.35",
        )
        .fromTo(
          "[data-hero-cta]",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.3",
        )
        .fromTo(
          "[data-hero-demo]",
          { autoAlpha: 0, y: 48, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.95 },
          "-=0.45",
        );

      // Slow parallax drift on the mesh while scrolling out of the hero.
      gsap.to("[data-hero-mesh]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope },
  );

  const words = HERO.headline.split(" ");

  return (
    <section ref={scope} className="relative -mt-20 overflow-hidden bg-canvas">
      {/* Mesh-gradient banner with rounded bottom (Arcade signature) */}
      <div
        aria-hidden
        data-hero-mesh
        className="pointer-events-none absolute inset-x-0 top-0 h-[760px] rounded-b-[2.75rem]"
        style={MESH}
      />
      {/* Faint grid texture over the mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[760px] rounded-b-[2.75rem] bg-[linear-gradient(to_right,rgba(43,47,56,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(43,47,56,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-4xl px-6 pt-28 text-center md:pt-32">
        <div
          data-hero-badge
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {HERO.badge}
        </div>

        <h1 className="mx-auto max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-[4.25rem]">
          {words.map((word, i) => (
            <span key={i} data-hero-word className="inline-block">
              {word}
              {i < words.length - 1 && <span>&nbsp;</span>}
            </span>
          ))}{" "}
          <span data-hero-word className="inline-block text-brand">
            {HERO.headlineAccent}
          </span>
        </h1>

        <p
          data-hero-sub
          className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-muted md:text-lg"
        >
          {HERO.subheadline}
        </p>

        <div data-hero-cta>
          <HeroEmailCheck />
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {user ? (
            <>
              <Link
                data-hero-cta
                href="/dashboard"
                className={buttonStyles({ variant: "primary", size: "lg" })}
              >
                Open dashboard
              </Link>
              <Link
                data-hero-cta
                href="/docs"
                className={buttonStyles({ variant: "secondary", size: "lg" })}
              >
                View docs
              </Link>
            </>
          ) : (
            <>
              <Link
                data-hero-cta
                href={HERO.primaryCta.href}
                className={buttonStyles({ variant: "primary", size: "lg" })}
              >
                {HERO.primaryCta.label}
              </Link>
              <Link
                data-hero-cta
                href={HERO.secondaryCta.href}
                className={buttonStyles({ variant: "secondary", size: "lg" })}
              >
                {HERO.secondaryCta.label}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Live platform window straddling the gradient fade */}
      <div
        data-hero-demo
        className="relative mx-auto mt-10 max-w-7xl px-6 pb-20 md:mt-12 md:px-8"
      >
        <PlatformShowcase />
      </div>
    </section>
  );
}

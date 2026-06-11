"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Reveal } from "@/components/marketing/animation/reveal";
import { HERO_STATS, type HeroStat } from "@/config/home";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Honest "by the numbers" band (Arcade's metrics section). No customer-result
 * claims — these are real product facts that count up as they scroll in.
 */
export function Metrics() {
  return (
    <section className="px-6 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            By the numbers
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Built to be fast, cheap, and honest.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {HERO_STATS.map((stat) => (
            <MetricCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ stat }: { stat: HeroStat }) {
  const numRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(() => {
    const el = numRef.current;
    if (!el) return;

    const fmt = (v: number) =>
      stat.decimals !== undefined
        ? v.toFixed(stat.decimals)
        : Math.round(v).toLocaleString();

    const counter = { v: 0 };
    el.textContent = fmt(0);

    gsap.to(counter, {
      v: stat.value,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onUpdate: () => {
        el.textContent = fmt(counter.v);
      },
    });
  });

  const display =
    stat.decimals !== undefined
      ? stat.value.toFixed(stat.decimals)
      : stat.value.toLocaleString();

  return (
    <div className="rounded-3xl border border-border bg-surface p-7 shadow-[var(--shadow-soft)] md:p-8">
      <div className="text-4xl font-semibold tabular-nums tracking-tight text-ink md:text-5xl">
        {stat.prefix}
        <span ref={numRef}>{display}</span>
        {stat.suffix}
      </div>
      <div className="mt-2 text-sm text-ink-muted">{stat.label}</div>
    </div>
  );
}

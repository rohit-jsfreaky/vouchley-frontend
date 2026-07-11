import {
  ArrowUpRight,
  Bot,
  CalendarX2,
  Globe,
  MailX,
  Server,
  UserX,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/marketing/animation/reveal";
import { WHAT_WE_DETECT } from "@/config/home";

const ICONS: LucideIcon[] = [MailX, Globe, Server, Bot, CalendarX2, UserX];

export function WhatWeDetect() {
  return (
    <section className="px-6 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            What we detect
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Six fraud signals,
            <br />
            one trust score.
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-ink-muted">
            Each verify call runs the full stack in parallel. You get a single
            decision plus the breakdown of every signal that fired — useful for
            tuning, debugging, and explaining a block to support.
          </p>
        </Reveal>

        <Reveal
          as="ul"
          stagger={0.08}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {WHAT_WE_DETECT.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li
                key={item.title}
                className="group rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:border-brand/30 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="mb-5 inline-flex size-10 items-center justify-center rounded-lg bg-subtle text-ink-muted transition-colors duration-300 group-hover:bg-brand-soft group-hover:text-brand">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {item.body}
                </p>
                {item.href && (
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand/80"
                    aria-label={item.hrefLabel ?? "Learn more"}
                  >
                    Learn more
                    <ArrowUpRight className="size-3.5" strokeWidth={2} />
                  </Link>
                )}
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

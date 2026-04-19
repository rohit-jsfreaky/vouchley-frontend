import { Package, Scale, Ship, type LucideIcon } from "lucide-react";

import { TENETS, type TenetIcon } from "@/config/about";

const ICONS: Record<TenetIcon, LucideIcon> = {
  ship: Ship,
  boring: Package,
  price: Scale,
};

export function AboutTenets() {
  return (
    <section className="bg-subtle py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <h2 className="mb-12 font-serif text-4xl text-ink">Core Tenets</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TENETS.map((tenet) => {
            const Icon = ICONS[tenet.icon];
            return (
              <article
                key={tenet.title}
                className="rounded-xl bg-surface p-8 shadow-[var(--shadow-editorial)]"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-subtle text-brand">
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-ink">
                  {tenet.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {tenet.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

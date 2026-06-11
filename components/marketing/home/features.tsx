import { Code2, ShieldCheck, Zap, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/marketing/animation/reveal";
import { FEATURES, type FeatureItem } from "@/config/home";

const ICONS: Record<FeatureItem["icon"], LucideIcon> = {
  code: Code2,
  zap: Zap,
  shield: ShieldCheck,
};

export function Features() {
  return (
    <section className="px-6 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Why Vouchley
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Built for developers,
            <br />
            priced for founders.
          </h2>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = ICONS[feature.icon];
  return (
    <article className="group rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_16px_40px_-20px_rgba(61,90,254,0.25)]">
      <div className="mb-6 inline-flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand transition-transform duration-300 group-hover:scale-110">
        <Icon className="size-6" strokeWidth={1.75} />
      </div>
      <h3 className="mb-2.5 text-xl font-semibold text-ink">{feature.title}</h3>
      <p className="leading-relaxed text-ink-muted">{feature.body}</p>
    </article>
  );
}

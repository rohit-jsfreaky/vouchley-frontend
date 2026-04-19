import { Code2, ShieldCheck, Zap, type LucideIcon } from "lucide-react";

import { FEATURES, type FeatureItem } from "@/config/home";

const ICONS: Record<FeatureItem["icon"], LucideIcon> = {
  code: Code2,
  zap: Zap,
  shield: ShieldCheck,
};

export function Features() {
  return (
    <section className="bg-subtle/60 px-6 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 text-center font-serif text-4xl text-ink">
          Built for developers
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = ICONS[feature.icon];
  return (
    <article className="rounded-xl bg-surface p-8 transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]">
      <div className="mb-6 text-brand">
        <Icon className="size-7" strokeWidth={1.75} />
      </div>
      <h3 className="mb-3 font-serif text-2xl text-ink">{feature.title}</h3>
      <p className="leading-relaxed text-ink-muted">{feature.body}</p>
    </article>
  );
}

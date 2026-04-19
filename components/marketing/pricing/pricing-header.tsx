import { PRICING_HEADER } from "@/config/pricing";

export function PricingHeader() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-center md:px-8">
      <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight text-brand md:text-6xl">
        {PRICING_HEADER.title}
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-ink-muted md:text-xl">
        {PRICING_HEADER.subtitle}
      </p>
    </section>
  );
}

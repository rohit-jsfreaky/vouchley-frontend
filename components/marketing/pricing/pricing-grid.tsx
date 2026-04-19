import { PricingCard } from "@/components/marketing/pricing/pricing-card";
import { PRICING_PLANS } from "@/config/pricing";

export function PricingGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 md:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PRICING_PLANS.map((plan) => (
          <PricingCard key={plan.slug} plan={plan} />
        ))}
      </div>
    </section>
  );
}

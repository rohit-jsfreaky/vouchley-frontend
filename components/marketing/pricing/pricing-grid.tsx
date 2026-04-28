import { PricingCard } from "@/components/marketing/pricing/pricing-card";
import { PRICING_PLANS } from "@/config/pricing";
import { getSessionServer } from "@/lib/auth-client";

export async function PricingGrid() {
  // Server-fetched once. Passed down so each card can rewrite its CTA target
  // (logged-in users go straight to /dashboard/billing instead of /signup).
  const user = await getSessionServer();

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 md:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PRICING_PLANS.map((plan) => (
          <PricingCard key={plan.slug} plan={plan} isLoggedIn={user !== null} />
        ))}
      </div>
    </section>
  );
}

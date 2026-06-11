import { SmoothScroll } from "@/components/marketing/animation/smooth-scroll";
import { Footer } from "@/components/layout/footer";
import { TopNav } from "@/components/layout/top-nav";
import { getSessionServer } from "@/lib/auth-client";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionServer();

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SmoothScroll />
      <TopNav user={user} />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
}

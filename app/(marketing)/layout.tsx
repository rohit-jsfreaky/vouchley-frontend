import { getSessionServer } from "@/lib/auth-client";
import { Footer } from "@/components/layout/footer";
import { TopNav } from "@/components/layout/top-nav";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionServer();

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav user={user} />
      <main className="flex-grow pt-24">{children}</main>
      <Footer />
    </div>
  );
}

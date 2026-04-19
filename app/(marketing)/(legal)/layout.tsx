import { LegalSidebar } from "@/components/legal/sidebar";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 md:flex-row md:px-8">
      <LegalSidebar />
      <article className="flex-1 rounded-2xl border border-border/20 bg-surface p-8 shadow-[0_20px_50px_-12px_rgba(31,27,22,0.03)] md:p-12">
        {children}
      </article>
    </div>
  );
}

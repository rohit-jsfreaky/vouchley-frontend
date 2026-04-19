import { DocsSidebar } from "@/components/docs/sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 md:px-8">
      <DocsSidebar />
      {children}
    </div>
  );
}

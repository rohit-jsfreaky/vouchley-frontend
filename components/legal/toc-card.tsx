import Link from "next/link";

export interface LegalTocItem {
  id: string;
  title: string;
}

export function LegalTocCard({ items }: { items: LegalTocItem[] }) {
  return (
    <nav
      aria-label="Contents"
      className="mb-12 rounded-xl bg-canvas p-6"
    >
      <h4 className="mb-4 font-semibold uppercase tracking-widest text-sm text-ink">
        Contents
      </h4>
      <ul className="space-y-3 text-sm text-brand">
        {items.map((item, idx) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className="hover:underline underline-offset-4 decoration-brand/30"
            >
              {idx + 1}. {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

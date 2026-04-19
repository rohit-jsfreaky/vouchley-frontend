export function LegalDocHeader({
  docId,
  title,
  effective,
  updated,
}: {
  docId: string;
  title: string;
  effective: string;
  updated: string;
}) {
  return (
    <header className="mb-12 border-b border-border/40 pb-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded bg-subtle px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
          Policy Document
        </span>
        <span className="font-mono text-[10px] text-ink-soft">
          ID: {docId}
        </span>
      </div>
      <h1 className="mb-4 font-serif text-5xl tracking-tight text-ink md:text-6xl">
        {title}
      </h1>
      <p className="text-sm text-ink-muted">
        Effective Date: <span className="font-mono">{effective}</span>
        <br />
        Last Updated: <span className="font-mono">{updated}</span>
      </p>
    </header>
  );
}

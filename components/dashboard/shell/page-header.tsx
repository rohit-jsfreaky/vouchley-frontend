export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="mb-2 font-serif text-5xl tracking-tight text-ink md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono text-sm text-ink-muted">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}

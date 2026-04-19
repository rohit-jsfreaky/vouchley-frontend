import { cn } from "@/lib/utils";

/**
 * Typographic primitives used inside doc page bodies. Keeps markup in pages
 * short + consistent and gives us one place to tune heading styles.
 */

export function DocH1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "mb-4 font-serif text-5xl tracking-tight text-ink md:text-6xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function DocLead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-12 max-w-2xl text-lg leading-relaxed text-ink-muted">
      {children}
    </p>
  );
}

export function DocH2({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mb-4 mt-12 scroll-mt-28 font-serif text-3xl text-ink"
    >
      {children}
    </h2>
  );
}

export function DocH3({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className="mb-3 mt-8 scroll-mt-28 font-sans text-lg font-semibold text-ink"
    >
      {children}
    </h3>
  );
}

export function DocP({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 text-base leading-relaxed text-ink-muted">{children}</p>
  );
}

export function DocCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-subtle px-1.5 py-0.5 font-mono text-[0.875em] text-ink">
      {children}
    </code>
  );
}

export function DocLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="font-medium text-brand underline decoration-brand/40 transition-colors hover:decoration-brand"
    >
      {children}
    </a>
  );
}

export function DocCallout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning";
  title: string;
  children: React.ReactNode;
}) {
  const palette =
    tone === "warning"
      ? "border-l-warning bg-warning-bg/40"
      : "border-l-brand bg-brand-soft/40";
  return (
    <aside
      className={cn(
        "my-8 rounded-r-xl border-l-4 bg-surface p-5",
        palette,
      )}
    >
      <h4 className="mb-1 font-semibold text-ink">{title}</h4>
      <div className="text-sm leading-relaxed text-ink-muted">{children}</div>
    </aside>
  );
}

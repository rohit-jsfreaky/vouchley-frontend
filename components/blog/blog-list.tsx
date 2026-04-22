"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { BlogIndexEntry } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface Props {
  posts: BlogIndexEntry[];
}

export function BlogList({ posts }: Props) {
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(() => {
    if (category === "All") return posts;
    return posts.filter((p) => p.category === category);
  }, [posts, category]);

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = featured ? filtered.filter((p) => p.slug !== featured.slug) : [];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
      <header className="py-16 md:py-24">
        <h1 className="font-serif text-5xl tracking-tight text-brand md:text-7xl">
          The Signal.
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-muted">
          Thoughts, technical deep dives, and editorial essays on building the
          future of signup verification.
        </p>
      </header>

      {categories.length > 1 && (
        <section className="mb-12">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded px-4 py-1.5 font-sans text-sm font-medium transition-colors",
                  cat === category
                    ? "bg-subtle text-brand"
                    : "bg-surface text-ink-muted hover:bg-muted",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {featured && <FeaturedCard post={featured} />}
          {rest.length > 0 && (
            <section className="mb-32 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </section>
          )}
        </>
      )}

      <NewsletterStrip />
    </div>
  );
}

function FeaturedCard({ post }: { post: BlogIndexEntry }) {
  return (
    <section className="mb-24">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col overflow-hidden rounded-xl bg-surface transition-shadow duration-300 hover:shadow-[var(--shadow-editorial)] md:flex-row"
      >
        <div className="flex flex-col justify-center bg-subtle/70 p-8 md:w-1/2 md:p-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded bg-accent-soft px-2 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              {post.category}
            </span>
            <span className="font-sans text-sm text-ink-muted">
              {formatDate(post.date)}
            </span>
          </div>
          <h2 className="mb-4 font-serif text-3xl leading-tight text-ink transition-colors group-hover:text-brand md:text-4xl">
            {post.title}
          </h2>
          <p className="mb-8 text-base leading-relaxed text-ink-muted line-clamp-3">
            {post.excerpt}
          </p>
          <div className="inline-flex items-center gap-2 font-sans font-medium text-brand transition-transform group-hover:translate-x-2">
            Read the essay
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </div>
        </div>
        <div className="relative h-64 bg-muted md:h-auto md:w-1/2">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : null}
        </div>
      </Link>
    </section>
  );
}

function BlogCard({ post }: { post: BlogIndexEntry }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-surface transition-all duration-200 hover:bg-canvas hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative h-48 bg-muted">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand">
            {post.category}
          </span>
          <span className="font-sans text-xs text-ink-soft">
            {formatDate(post.date)}
          </span>
        </div>
        <h3 className="font-serif text-xl leading-snug text-ink transition-colors group-hover:text-brand">
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed text-ink-muted line-clamp-2">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-border/30 pt-4">
          <span className="font-sans text-xs text-ink-muted">
            By {post.author}
          </span>
          <span className="flex items-center gap-1 font-sans text-xs font-semibold text-brand">
            Read
            <ArrowRight className="size-3" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <section className="mb-32 rounded-xl border border-border/40 bg-surface py-20 text-center">
      <p className="font-serif text-2xl text-ink">No posts in this category yet.</p>
      <p className="mt-2 text-ink-muted">Check back soon.</p>
    </section>
  );
}

function NewsletterStrip() {
  return (
    <section className="mb-24 rounded-2xl border-t border-border/30 bg-subtle/70 p-10 md:p-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-4 font-serif text-3xl text-ink">
          Subscribe to The Signal
        </h2>
        <p className="mb-8 text-ink-muted">
          Get the latest essays and technical deep-dives delivered directly to
          your inbox.
        </p>
        <form
          className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row"
          action="https://vouchley.getrevlio.com/contact"
          method="post"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Your email address"
            className="flex-grow rounded-lg border border-border bg-surface px-4 py-3 font-sans text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-lg bg-brand px-6 py-3 font-sans font-semibold text-ink-inverse transition-colors hover:bg-brand-hover"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-4 font-sans text-xs text-ink-soft">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

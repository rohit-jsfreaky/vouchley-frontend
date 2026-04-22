import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { remark } from "remark";

import type { BlogIndexEntry, BlogPost } from "@/lib/blog";

interface Props {
  post: BlogPost;
  related: BlogIndexEntry[];
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return String(result);
}

export async function BlogDetail({ post, related }: Props) {
  const html = await markdownToHtml(post.content);

  return (
    <article className="w-full">
      {/* Header */}
      <header className="mx-auto max-w-3xl px-6 pt-12 pb-10 md:pt-16">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-3" strokeWidth={1.75} />
          Back to The Signal
        </Link>

        <div className="mb-6 flex flex-wrap gap-2">
          <span className="rounded bg-accent-soft px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
            {post.category}
          </span>
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-subtle px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mb-6 font-serif text-4xl leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
          {post.title}
        </h1>

        <p className="mb-8 font-serif text-xl leading-relaxed text-ink-muted">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 border-t border-border/30 pt-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-soft font-serif text-xl text-brand">
            {post.author[0]?.toUpperCase() ?? "V"}
          </div>
          <div>
            <div className="font-sans font-semibold text-ink">{post.author}</div>
            <div className="font-sans text-sm text-ink-muted">
              {formatDate(post.date)} · {post.readingTime} min read
            </div>
          </div>
        </div>
      </header>

      {/* Cover */}
      {post.image && (
        <figure className="mx-auto mb-12 max-w-5xl px-6">
          <div className="relative aspect-[2/1] overflow-hidden rounded-xl bg-muted">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </figure>
      )}

      {/* Body */}
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* Author bio */}
      <section className="mx-auto mb-20 max-w-3xl px-6">
        <div className="flex flex-col items-start gap-6 rounded-xl border border-border/20 bg-surface p-8 sm:flex-row">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-brand-soft font-serif text-3xl text-brand">
            {post.author[0]?.toUpperCase() ?? "V"}
          </div>
          <div>
            <h3 className="mb-2 font-serif text-2xl text-ink">{post.author}</h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              Writing about signup verification, fraud prevention, and the
              boring-tech philosophy behind building Vouchley.
            </p>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-border/20 bg-subtle/40 py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <h2 className="mb-10 font-serif text-3xl text-ink">
              Further reading
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block"
                >
                  <div className="mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                    {p.image && (
                      <div className="relative size-full">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                    {p.category}
                  </div>
                  <h3 className="mb-2 font-serif text-xl text-ink transition-colors group-hover:text-brand">
                    {p.title}
                  </h3>
                  <p className="text-sm text-ink-muted line-clamp-2">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

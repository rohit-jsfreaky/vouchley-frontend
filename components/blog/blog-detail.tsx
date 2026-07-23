import { ArrowLeft, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { remark } from "remark";

import { BlogCta } from "@/components/blog/blog-cta";
import type { BlogIndexEntry, BlogPost } from "@/lib/blog";

// Brand icons inlined — lucide-react v1.x dropped Github / Linkedin / Twitter
// for trademark reasons. These are small presentational SVGs, no JS overhead.
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

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

      {/* Body + conversion CTA. Article stays centered (aligned with the FAQ
          below); on wide screens the CTA floats in the right gutter as a sticky
          sidebar, and on tablet/mobile it drops inline right after the article. */}
      <div className="relative mx-auto max-w-3xl px-6 pb-12">
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <aside className="mt-12 xl:absolute xl:left-full xl:top-0 xl:ml-8 xl:mt-0 xl:w-[300px]">
          <div className="xl:sticky xl:top-24">
            <BlogCta />
          </div>
        </aside>
      </div>

      {/* FAQ block — emitted only when frontmatter declares one. The same
          Q&A array drives the FAQPage JSON-LD on the page, so on-page and
          machine-readable content can never drift. */}
      {post.faq && post.faq.length > 0 && (
        <section className="mx-auto mb-16 max-w-3xl px-6">
          <h2 className="mb-8 font-serif text-3xl text-ink md:text-4xl">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {post.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-border/30 bg-surface p-6 open:bg-surface"
              >
                <summary className="cursor-pointer list-none font-serif text-lg text-ink group-open:mb-3">
                  {item.question}
                </summary>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Author bio — uses rich `authorBio` frontmatter when present,
          falls back to the default boilerplate otherwise. */}
      <section className="mx-auto mb-20 max-w-3xl px-6">
        <div className="flex flex-col items-start gap-6 rounded-xl border border-border/20 bg-surface p-8 sm:flex-row">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-brand-soft font-serif text-3xl text-brand">
            {(post.authorBio?.name ?? post.author)[0]?.toUpperCase() ?? "V"}
          </div>
          <div className="flex-1">
            <h3 className="mb-1 font-serif text-2xl text-ink">
              {post.authorBio?.name ?? post.author}
            </h3>
            {post.authorBio?.title && (
              <div className="mb-3 font-mono text-xs uppercase tracking-widest text-brand">
                {post.authorBio.title}
              </div>
            )}
            <p className="mb-4 text-sm leading-relaxed text-ink-muted">
              {post.authorBio?.bio ??
                "Writing about signup verification, fraud prevention, and the boring-tech philosophy behind building Vouchley."}
            </p>
            {post.authorBio?.links && (
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {post.authorBio.links.twitter && (
                  <a
                    href={post.authorBio.links.twitter}
                    rel="noopener noreferrer me"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-brand"
                  >
                    <XIcon className="size-4" />
                    <span>X / Twitter</span>
                  </a>
                )}
                {post.authorBio.links.linkedin && (
                  <a
                    href={post.authorBio.links.linkedin}
                    rel="noopener noreferrer me"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-brand"
                  >
                    <LinkedinIcon className="size-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {post.authorBio.links.github && (
                  <a
                    href={post.authorBio.links.github}
                    rel="noopener noreferrer me"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-brand"
                  >
                    <GithubIcon className="size-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {post.authorBio.links.website && (
                  <a
                    href={post.authorBio.links.website}
                    rel="noopener noreferrer me"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-brand"
                  >
                    <Globe className="size-4" strokeWidth={1.75} aria-hidden />
                    <span>Website</span>
                  </a>
                )}
              </div>
            )}
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

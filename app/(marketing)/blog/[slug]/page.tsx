import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogDetail } from "@/components/blog/blog-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/config/site";
import { getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  howToJsonLd,
} from "@/lib/seo";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return buildMetadata({
      title: "Post not found",
      description: "This blog post does not exist.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    // Keyword-first SERP title (<60 chars) when provided; the on-page H1 keeps
    // the fuller `title`. Description likewise prefers a tuned metaDescription.
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    path: `/blog/${slug}`,
    image: post.image,
    keywords: post.keywords,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updatedAt,
    authors: [post.author],
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  return (
    <>
      <JsonLd
        data={blogPostingJsonLd({
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          image: post.image,
          publishedTime: post.date,
          modifiedTime: post.updatedAt,
          author: post.author,
          keywords: post.keywords,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Blog", url: `${SITE.url}/blog` },
          { name: post.title, url: `${SITE.url}/blog/${post.slug}` },
        ])}
      />
      {post.faq && post.faq.length > 0 && (
        <JsonLd data={faqJsonLd(post.faq)} />
      )}
      {post.howTo && post.howTo.steps.length > 0 && (
        <JsonLd
          data={howToJsonLd({
            name: post.howTo.name,
            description: post.howTo.description,
            totalTime: post.howTo.totalTime,
            steps: post.howTo.steps,
          })}
        />
      )}
      <BlogDetail post={post} related={related} />
    </>
  );
}

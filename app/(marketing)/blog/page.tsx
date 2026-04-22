import type { Metadata } from "next";

import { BlogList } from "@/components/blog/blog-list";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/config/site";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "The Signal — Essays on signup verification and SaaS fraud prevention",
  description:
    "Technical deep-dives, engineering essays, and product notes on building the signup verification API. Learn how real SaaS teams block fake signups, disposable emails, and bot abuse.",
  path: "/blog",
  keywords: [
    "signup verification blog",
    "fraud prevention blog",
    "SaaS engineering blog",
    "email validation best practices",
    "bot signup detection",
  ],
});

export default function BlogPage() {
  const posts = getAllPosts();
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The Signal",
    description: metadata.description,
    url: `${SITE.url}/blog`,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: `${SITE.url}/favicon-512x512.png`,
    },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE.url}/blog/${p.slug}`,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author },
    })),
  };

  return (
    <>
      <JsonLd data={blogJsonLd} />
      <BlogList posts={posts} />
    </>
  );
}

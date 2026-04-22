/**
 * Central SEO metadata helpers.
 *
 * Every marketing page calls `buildMetadata()` with its unique title,
 * description, and path. The helper fills in canonical URL, OG tags,
 * Twitter card, keywords, and robots directives consistently.
 */
import type { Metadata } from "next";

import { SITE } from "@/config/site";

export interface SeoInput {
  title: string;
  description: string;
  path: string; // leading slash, e.g. "/pricing"
  image?: string; // absolute or relative
  keywords?: readonly string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

export function buildMetadata(input: SeoInput): Metadata {
  const url = `${SITE.url}${input.path}`;
  const image = input.image
    ? input.image.startsWith("http")
      ? input.image
      : `${SITE.url}${input.image}`
    : `${SITE.url}${SITE.defaultOgImage}`;

  const keywords = [...(input.keywords ?? []), ...SITE.keywords];

  return {
    title: input.title,
    description: input.description,
    keywords: keywords.join(", "),
    alternates: { canonical: url },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type: input.type ?? "website",
      url,
      title: input.title,
      description: input.description,
      siteName: SITE.name,
      locale: "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
      ...(input.type === "article" && {
        publishedTime: input.publishedTime,
        modifiedTime: input.modifiedTime,
        authors: input.authors,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
      creator: SITE.twitter,
    },
    authors: input.authors?.map((name) => ({ name })),
  };
}

/**
 * JSON-LD builders — stringify and drop into a <script> tag on the page.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/favicon-512x512.png`,
    sameAs: ["https://twitter.com/vouchley"],
    description: SITE.description,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    url: SITE.url,
    description: SITE.description,
    offers: {
      "@type": "Offer",
      price: "29.00",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "29.00",
        priceCurrency: "USD",
        billingIncrement: 1,
        unitText: "MONTH",
      },
    },
    aggregateRating: undefined,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function blogPostingJsonLd(input: {
  title: string;
  description: string;
  slug: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  keywords?: string[];
}) {
  const url = `${SITE.url}/blog/${input.slug}`;
  const image = input.image.startsWith("http")
    ? input.image
    : `${SITE.url}${input.image}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    image,
    datePublished: input.publishedTime,
    dateModified: input.modifiedTime ?? input.publishedTime,
    author: {
      "@type": "Person",
      name: input.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/favicon-512x512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords: input.keywords?.join(", "),
  };
}


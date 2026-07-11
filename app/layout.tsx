import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";

import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { WebMcpProvider } from "@/components/web-mcp/web-mcp-provider";
import { SITE } from "@/config/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

/**
 * Satoshi (Fontshare, free commercial license) — variable 300–900. The
 * premium modern grotesque; everything inherits it via --font-sans.
 */
const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    // Brand once at the end, keyword phrase first. Pages that override via
    // buildMetadata() get the same `— Vouchley` suffix via the template.
    default: `${SITE.title} — ${SITE.name}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  manifest: "/site.webmanifest",
  alternates: { canonical: "/" },
  robots: {
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
    type: "website",
    url: SITE.url,
    title: `${SITE.title} — ${SITE.name}`,
    description: SITE.description,
    siteName: SITE.name,
    locale: "en_US",
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.title} — ${SITE.name}`,
    description: SITE.description,
    images: [SITE.defaultOgImage],
    creator: SITE.twitter,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  verification: {
    google: "b6f7c2enVZ4-58O3JBgrGgON1pqkkd_RCIXRngee2M4",
  },
  // Reinforces the "Vouchley" brand name to crawlers/preview tools that
  // otherwise default to the parent domain (getrevlio.com) on subdomains.
  other: {
    "twitter:domain": "vouchley.getrevlio.com",
    "twitter:url": SITE.url,
    "apple-mobile-web-app-title": SITE.name,
    "application-name": SITE.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#3D5AFE",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${serif.variable} ${mono.variable}`}
    >
      <head>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </head>
      <body>
        <WebMcpProvider />
        <PostHogProvider>{children}</PostHogProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-surface)",
              color: "var(--color-ink)",
              border: "1px solid var(--color-border)",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}

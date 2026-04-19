import type { Metadata } from "next";

import { DocCode, DocH2, DocLink, DocP } from "@/components/docs/doc-typography";
import { LegalDocHeader } from "@/components/legal/doc-header";
import { LegalTocCard, type LegalTocItem } from "@/components/legal/toc-card";
import { LEGAL_CONTACT_EMAIL } from "@/config/legal";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Cookie Policy — ${SITE.name}`,
  description:
    "The small set of cookies Vouchley uses, why each one exists, and how to manage them.",
};

const TOC: LegalTocItem[] = [
  { id: "what-are-cookies", title: "What are cookies" },
  { id: "what-we-use", title: "Cookies we use" },
  { id: "third-party", title: "Third-party cookies" },
  { id: "managing", title: "Managing cookies" },
];

export default function CookiesPage() {
  return (
    <>
      <LegalDocHeader
        docId="COK-2026-04"
        title="Cookie Policy"
        effective="April 19, 2026"
        updated="April 19, 2026"
      />

      <LegalTocCard items={TOC} />

      <div className="space-y-2 text-[15px] leading-relaxed text-ink-muted">
        <DocH2 id="what-are-cookies">What are cookies</DocH2>
        <DocP>
          Cookies are small text files that a website stores in your browser.
          They let the site remember things about you between visits — in our
          case, mostly whether you&rsquo;re signed in.
        </DocP>

        <DocH2 id="what-we-use">Cookies we use</DocH2>
        <DocP>Vouchley sets a deliberately small number of cookies.</DocP>
        <ul className="mb-6 list-disc space-y-3 pl-6 text-base leading-relaxed text-ink-muted">
          <li>
            <strong>Session cookie</strong> (
            <DocCode>better-auth.session_token</DocCode>): essential. Tells us
            you&rsquo;re signed in while you use the dashboard. Set as
            HTTP-only, <DocCode>Secure</DocCode>, and{" "}
            <DocCode>SameSite=Lax</DocCode>. Expires when you sign out or after
            30 days of inactivity.
          </li>
          <li>
            <strong>CSRF token</strong> (
            <DocCode>better-auth.csrf_token</DocCode>): essential. Protects
            form submissions in the dashboard from cross-site request forgery.
          </li>
          <li>
            <strong>OAuth state</strong> (<DocCode>better-auth.state_*</DocCode>):
            essential, short-lived. Set during Google sign-in to verify the
            redirect is legitimate; removed as soon as sign-in completes.
          </li>
        </ul>
        <DocP>
          None of these cookies are used for advertising or cross-site tracking.
        </DocP>

        <DocH2 id="third-party">Third-party cookies</DocH2>
        <DocP>
          If you&rsquo;ve opted into product analytics, PostHog sets a cookie
          to distinguish one browser session from another inside the dashboard.
          We do not embed any advertising trackers, no Google Analytics, no
          Facebook pixel, no TikTok pixel.
        </DocP>
        <DocP>
          Cloudflare may set a lightweight bot-protection cookie at the edge.
          See{" "}
          <DocLink href="https://www.cloudflare.com/cookie-policy/">
            Cloudflare&rsquo;s cookie policy
          </DocLink>
          {" "}for details.
        </DocP>

        <DocH2 id="managing">Managing cookies</DocH2>
        <DocP>
          Every browser lets you see and clear cookies in its settings. Blocking
          our essential cookies will break sign-in; blocking analytics cookies
          only affects the product-analytics feature.
        </DocP>
        <DocP>
          Questions? Email{" "}
          <DocLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </DocLink>
          .
        </DocP>
      </div>
    </>
  );
}

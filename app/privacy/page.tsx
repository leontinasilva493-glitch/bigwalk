import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../../components/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Big Walk Walkthrough handles analytics, browser storage, embedded videos, and visitor privacy.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
  openGraph: {
    url: '/privacy',
    title: 'Privacy Policy | Big Walk Walkthrough',
    description: 'How Big Walk Walkthrough handles analytics, browser storage, embedded videos, and visitor privacy.',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="guide-page">
        <article className="guide-article">
          <header className="guide-hero">
            <p className="guide-kicker">SITE POLICY</p>
            <h1>Privacy Policy</h1>
            <p className="guide-description">
              Big Walk Walkthrough is an independent fan reference site. We do not require accounts, collect passwords, or sell personal data.
            </p>
            <p className="guide-meta">Effective date: August 8, 2026 · Updated: November 23, 2026</p>
          </header>

          <section className="route-overview">
            <h2>1. Information we collect automatically</h2>
            <p>
              To understand which puzzle guides help players and where pages fail on mobile or desktop browsers, this site loads aggregate web analytics:
            </p>
            <ul>
              <li>
                <strong>Google Analytics 4 (GA4):</strong> Collects anonymized page views, referrer information, approximate region, and device category using first-party cookies. You can opt out at any time with the{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">Google Analytics Opt-out Add-on</a> or browser tracking controls.
              </li>
              <li>
                <strong>Microsoft Clarity:</strong> Records anonymized scroll depth, clicks, and layout interaction patterns after browser idle time so broken navigation or confusing sections can be fixed. Review the{' '}
                <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noreferrer">Microsoft Privacy Statement</a> for details.
              </li>
              <li>
                <strong>Cloudflare &amp; PVUV Web Analytics:</strong> Requests pass through Cloudflare&apos;s edge network for security, caching, and bot-filtered traffic measurement without storing personal profiles.
              </li>
            </ul>
          </section>

          <section className="route-overview">
            <h2>2. Local browser storage</h2>
            <p>
              The <Link href="/map">Interactive Map</Link> stores your optional puzzle checklist progress in your own browser&apos;s <code>localStorage</code>. That checklist stays on your device and is never transmitted to our servers. Clearing site data in your browser resets it immediately.
            </p>
          </section>

          <section className="route-overview">
            <h2>3. Embedded third-party videos</h2>
            <p>
              Some guides include optional YouTube route demonstrations using privacy-enhanced <code>youtube-nocookie.com</code> embeds. Video iframes are deferred and do not load until you explicitly select &ldquo;Load video&rdquo; on the page.
            </p>
          </section>

          <section className="route-overview">
            <h2>4. Advertising &amp; cookies</h2>
            <p>
              We do not run pop-under scripts, deceptive download buttons, or forced redirects. If display advertising (such as Google AdSense) is enabled in the future, this policy and our <code>/ads.txt</code> record will be updated to list authorized sellers and cookie consent options for applicable regions.
            </p>
          </section>

          <section className="route-overview">
            <h2>5. Contact &amp; data requests</h2>
            <p>
              For privacy questions, takedown requests, or corrections, please visit our <Link href="/contact">Contact page</Link>.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

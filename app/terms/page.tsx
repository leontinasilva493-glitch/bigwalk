import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../../components/site';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use, fan-site disclaimer, and intellectual property notice for Big Walk Walkthrough.',
  alternates: { canonical: '/terms' },
  robots: { index: false, follow: true },
  openGraph: {
    url: '/terms',
    title: 'Terms of Use | Big Walk Walkthrough',
    description: 'Terms of use, fan-site disclaimer, and intellectual property notice for Big Walk Walkthrough.',
  },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="guide-page">
        <article className="guide-article">
          <header className="guide-hero">
            <p className="guide-kicker">SITE POLICY</p>
            <h1>Terms of Use</h1>
            <p className="guide-description">
              By browsing Big Walk Walkthrough (<code>bigwalkwalkthrough.com</code>), you agree to these straightforward terms for using our puzzle guides and reference tools.
            </p>
            <p className="guide-meta">Effective date: August 8, 2026 · Updated: November 23, 2026</p>
          </header>

          <section className="route-overview">
            <h2>1. Independent fan guide disclaimer</h2>
            <p>
              Big Walk Walkthrough is an unofficial, independent fan reference site. It is not affiliated with, endorsed by, or sponsored by <strong>House House</strong> or <strong>Panic Inc.</strong>{' '}
              <em>Big Walk</em>, its characters, game world, and official press kit imagery remain the intellectual property of their respective owners. Official game information is available at{' '}
              <a href="https://bigwalk.game/" target="_blank" rel="noreferrer">bigwalk.game</a>.
            </p>
          </section>

          <section className="route-overview">
            <h2>2. Use of site content</h2>
            <p>
              You may freely read, link to, and share URLs from this site for personal, non-commercial use while playing with your group. Please do not scrape, mirror, or republish our written guides, schematic maps, or structured layouts wholesale on other websites without permission.
            </p>
          </section>

          <section className="route-overview">
            <h2>3. Accuracy &amp; game updates</h2>
            <p>
              Puzzle layouts in <em>Big Walk</em> can adapt to 2-player, 3-player, and 4+ host world settings and may change across game patches. Every guide cites its checked sources and version context, and is provided &ldquo;as is&rdquo; without warranty. Visit our <Link href="/contact">Contact page</Link> if a current patch changes a route.
            </p>
          </section>

          <section className="route-overview">
            <h2>4. External links</h2>
            <p>
              Our source sections link out to official pages, Steam discussions, Reddit threads, and YouTube walkthrough creators so players can verify context directly. We are not responsible for external websites or third-party user comments.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

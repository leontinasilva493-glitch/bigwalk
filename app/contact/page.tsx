import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../../components/site';

export const metadata: Metadata = {
  title: 'Contact & Corrections',
  description: 'Contact Big Walk Walkthrough to report puzzle route updates, world-size differences, or copyright inquiries.',
  alternates: { canonical: '/contact' },
  robots: { index: true, follow: true },
  openGraph: {
    url: '/contact',
    title: 'Contact & Corrections | Big Walk Walkthrough',
    description: 'Contact Big Walk Walkthrough to report puzzle route updates, world-size differences, or copyright inquiries.',
  },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="guide-page">
        <article className="guide-article">
          <header className="guide-hero">
            <p className="guide-kicker">REACH THE EDITORS</p>
            <h1>Contact &amp; Route Corrections</h1>
            <p className="guide-description">
              Found a puzzle variation in a 2-player, 3-player, or 4+ world, a broken link, or a copyright/attribution request? Send us the details and we will verify and update the guide.
            </p>
            <p className="guide-meta">Response target: within 2–3 business days</p>
          </header>

          <section className="route-overview">
            <h2>Email contact</h2>
            <p>
              Reach the editorial maintainer directly at:{' '}
              <a href="mailto:duckweed1014@gmail.com">duckweed1014@gmail.com</a>
            </p>
          </section>

          <section className="route-overview">
            <h2>What helps us verify a puzzle report fastest</h2>
            <ul>
              <li>The exact guide URL on <code>bigwalkwalkthrough.com</code>.</li>
              <li>Your platform (PC, Mac, PS5, or Nintendo Switch 2) and current game version (see <Link href="/patch-notes">Patch Notes</Link>).</li>
              <li>Which world-size setting the host selected (2-player, 3-player, or 4+).</li>
              <li>Nearby landmarks, coordinates, or an uncropped screenshot showing the puzzle state.</li>
            </ul>
          </section>

          <section className="route-overview">
            <h2>Copyright &amp; attribution requests</h2>
            <p>
              We attribute all referenced community videos, official press kit stills, and third-party guides directly on each page. If you are a creator or rights holder and want an attribution updated or a reference removed, email <a href="mailto:duckweed1014@gmail.com">duckweed1014@gmail.com</a> with the URL and we will act promptly.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

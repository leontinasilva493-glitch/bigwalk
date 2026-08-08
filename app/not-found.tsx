import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../components/site';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The requested Big Walk guide page does not exist.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="launch-page page-shell">
        <article className="launch-page__article">
          <p className="verification-status">404</p>
          <h1>Page not found</h1>
          <p className="launch-page__lede">This guide page does not exist or has not been published yet.</p>
          <p className="launch-page__back"><Link href="/puzzles">Browse available hints</Link></p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

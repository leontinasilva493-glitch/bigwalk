import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from './json-ld';
import { SiteFooter, SiteHeader } from './site';
import { site } from '../lib/content.mjs';
import { MapIcon, RadioIcon, TrophyIcon, Walker } from './game-elements';

type LaunchPage = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  active: 'beginner' | 'multiplayer' | 'achievements';
  scope: string;
  illustration: 'walker' | 'radio' | 'trophy' | 'map';
};

export function launchMetadata(page: LaunchPage): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    robots: { index: false, follow: true },
  };
}

export function LaunchPageTemplate({ page }: { page: LaunchPage }) {
  const url = `${site.url}/${page.slug}`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.description,
    dateModified: '2026-08-08',
    mainEntityOfPage: url,
    publisher: { '@type': 'Organization', name: site.name },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: page.h1, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <SiteHeader active={page.active} />
      <main className="launch-page page-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">{page.h1}</li></ol></nav>
        <article className="launch-page__article">
          <div className="launch-page__illustration" aria-hidden="true">
            {page.illustration === 'walker' ? <Walker color="orange" pose="walk" /> : null}
            {page.illustration === 'radio' ? <RadioIcon /> : null}
            {page.illustration === 'trophy' ? <TrophyIcon /> : null}
            {page.illustration === 'map' ? <MapIcon /> : null}
          </div>
          <h1>{page.h1}</h1>
          <p className="launch-page__lede">{page.description}</p>
          <section className="hint-block" aria-labelledby="launch-scope-title">
            <p className="hint-block__kicker">PAGE SCOPE</p>
            <h2 id="launch-scope-title">What this topic covers</h2>
            <p>{page.scope}</p>
          </section>
          <p className="launch-page__back"><Link href="/puzzles">Browse the puzzle directory</Link></p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

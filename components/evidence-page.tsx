import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from './json-ld';
import { SiteFooter, SiteHeader } from './site';
import { MapIcon, RadioIcon, TrophyIcon, Walker } from './game-elements';
import { guides, site, siteSectionBySlug } from '../lib/content.mjs';

type SectionRecord = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  active: string;
  scope: string;
  evidenceNeeds: string[];
  relatedSlugs: string[];
  illustration: string;
};

function relatedTitle(slug: string) {
  const guide = guides.find((entry) => entry.slug === slug);
  if (guide) return guide.h1;
  const section = siteSectionBySlug(slug);
  if (section) return section.h1;
  if (slug === 'puzzles') return 'Big Walk Puzzle Directory';
  if (slug === 'beginner-guide') return 'Big Walk Beginner Guide';
  return slug;
}

export function evidenceMetadata(page: SectionRecord): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    robots: { index: false, follow: true },
    openGraph: { url: `/${page.slug}`, title: page.title, description: page.description },
    twitter: { card: 'summary', title: page.title, description: page.description },
  };
}

export function EvidencePage({ page }: { page: SectionRecord }) {
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
      <SiteHeader active={page.active as 'puzzles' | 'beginner' | 'multiplayer' | 'achievements'} />
      <main className="evidence-page page-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol><li><Link href="/">Home</Link></li><li aria-current="page">{page.h1}</li></ol>
        </nav>
        <article className="evidence-page__article">
          <div className="evidence-page__illustration" aria-hidden="true">
            {page.illustration === 'walker' ? <Walker color="orange" pose="walk" /> : null}
            {page.illustration === 'radio' ? <RadioIcon /> : null}
            {page.illustration === 'trophy' ? <TrophyIcon /> : null}
            {page.illustration === 'map' ? <MapIcon /> : null}
          </div>
          <p className="verification-status" role="status">Verification in progress</p>
          <h1>{page.h1}</h1>
          <p className="evidence-page__lede">{page.description}</p>

          <section className="hint-block" aria-labelledby="scope-heading">
            <p className="hint-block__kicker">WHY THIS PAGE EXISTS</p>
            <h2 id="scope-heading">A focused place for one question</h2>
            <p>{page.scope}</p>
          </section>

          <section className="verification-panel" aria-labelledby="evidence-heading">
            <h2 id="evidence-heading">What we still need to verify</h2>
            <p>This page is deliberately not a completed answer yet. It stays out of search indexing until current, first-hand evidence supports the guidance.</p>
            <ul className="evidence-checklist">
              {page.evidenceNeeds.map((need) => <li key={need}>{need}</li>)}
            </ul>
          </section>

          {page.relatedSlugs.length ? (
            <section className="related-guides" aria-labelledby="related-heading">
              <h2 id="related-heading">Related pages</h2>
              <ul>
                {page.relatedSlugs.map((slug) => <li key={slug}><Link href={`/${slug}`}>{relatedTitle(slug)}</Link></li>)}
              </ul>
            </section>
          ) : null}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

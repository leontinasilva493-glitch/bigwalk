import type { Metadata } from 'next';
import Link from 'next/link';
import { PuzzleCard } from './guides';
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
  indexable: boolean;
  updated?: string;
  verificationLabel?: string;
  challenges?: Array<{
    name: string;
    href?: string;
    visualCues: string;
    position: string;
    prerequisiteItem: string;
    transport: string;
    playerCount: string;
    verificationStatus: string;
  }>;
  pendingFirstHand?: Array<{ label: string; value: string }>;
  sources?: Array<{ title: string; publisher: string; url: string }>;
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
    robots: { index: page.indexable, follow: true },
    openGraph: { url: `/${page.slug}`, title: page.title, description: page.description },
    twitter: { card: 'summary', title: page.title, description: page.description },
  };
}

export function EvidencePage({ page, featuredGuides = [] }: { page: SectionRecord; featuredGuides?: Array<(typeof guides)[number]> }) {
  const url = `${site.url}/${page.slug}`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.description,
    dateModified: page.updated ?? '2026-08-08',
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
      <SiteHeader active={page.active as 'puzzles' | 'walkthrough' | 'beginner' | 'multiplayer' | 'help' | 'achievements' | 'purple-challenges'} />
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
          <p className="verification-status" role="status">{page.verificationLabel ?? 'Verification in progress'}</p>
          <h1>{page.h1}</h1>
          <p className="evidence-page__lede">{page.description}</p>

          <section className="hint-block" aria-labelledby="scope-heading">
            <p className="hint-block__kicker">WHY THIS PAGE EXISTS</p>
            <h2 id="scope-heading">A focused place for one question</h2>
            <p>{page.scope}</p>
          </section>

          {page.challenges?.length ? (
            <section className="challenge-directory" aria-labelledby="challenge-directory-heading">
              <p className="hint-block__kicker">PURPLE CHALLENGE DIRECTORY</p>
              <h2 id="challenge-directory-heading">Seven reported purple challenges</h2>
              <p>Names are community working names, not official labels. “Source-checked” means the listed cue or map marker appears in the cited sources; it does not promote an untested reward or unlock mechanism to fact.</p>
              <div className="challenge-directory__table-wrap">
                <table>
                  <thead>
                    <tr><th>Community name</th><th>Visual cues</th><th>Position / coordinates</th><th>Prerequisite item</th><th>Transport</th><th>Players</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {page.challenges.map((challenge) => (
                      <tr key={challenge.name}>
                        <th scope="row">{challenge.href ? <Link href={challenge.href}>{challenge.name}</Link> : challenge.name}</th>
                        <td>{challenge.visualCues}</td>
                        <td>{challenge.position}</td>
                        <td>{challenge.prerequisiteItem}</td>
                        <td>{challenge.transport}</td>
                        <td>{challenge.playerCount}</td>
                        <td><span className="evidence-label">{challenge.verificationStatus}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <section className="verification-panel" aria-labelledby="evidence-heading">
            <h2 id="evidence-heading">What we still need to verify</h2>
            <p>{page.indexable
              ? 'This directory is publishable because its names, visual cues, and mapped positions are source-labelled. The following gameplay conclusions still require current first-hand evidence.'
              : 'This page is deliberately not a completed answer yet. It stays out of search indexing until current, first-hand evidence supports the guidance.'}</p>
            {page.pendingFirstHand?.length ? (
              <dl className="pending-facts">
                {page.pendingFirstHand.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
              </dl>
            ) : null}
            <ul className="evidence-checklist">
              {page.evidenceNeeds.map((need) => <li key={need}>{need}</li>)}
            </ul>
            {page.sources?.length ? (
              <div className="guide-sources">
                <h3>Source links</h3>
                <ul>{page.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> <span>— {source.publisher}</span></li>)}</ul>
              </div>
            ) : null}
          </section>

          {featuredGuides.length ? (
            <section className="evidence-page__available" aria-labelledby="available-routes-heading">
              <h2 id="available-routes-heading">Available routes</h2>
              <p>These route pages have source-checked content. Their evidence panels state what still needs a local capture.</p>
              <div className="puzzle-list">
                {featuredGuides.map((guide) => <PuzzleCard guide={guide} key={guide.slug} />)}
              </div>
            </section>
          ) : null}

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

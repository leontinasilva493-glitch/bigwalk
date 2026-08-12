import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from './json-ld';
import { SiteFooter, SiteHeader } from './site';
import { MapIcon, RadioIcon } from './game-elements';
import { site, siteSectionBySlug } from '../lib/content.mjs';
import { troubleshootingBySlug, troubleshootingGuides } from '../lib/troubleshooting-content.mjs';

type TroubleshootingRecord = (typeof troubleshootingGuides)[number];

export function troubleshootingMetadata(guide: TroubleshootingRecord): Metadata {
  const path = `/troubleshooting/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: path },
    robots: { index: guide.indexable, follow: true },
    openGraph: { url: path, title: guide.title, description: guide.description },
    twitter: { card: 'summary', title: guide.title, description: guide.description },
  };
}

function sourceBoundary(source: TroubleshootingRecord['sources'][number]) {
  return (
    <li key={source.url}>
      <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>{' '}
      <span>— {source.publisher}. {source.note}</span>
    </li>
  );
}

export function TroubleshootingGuide({ guide }: { guide: TroubleshootingRecord }) {
  const path = `/troubleshooting/${guide.slug}`;
  const url = `${site.url}${path}`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.h1,
    description: guide.description,
    dateModified: guide.updated,
    mainEntityOfPage: url,
    publisher: { '@type': 'Organization', name: site.name },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Troubleshooting', item: `${site.url}/troubleshooting` },
      { '@type': 'ListItem', position: 3, name: guide.h1, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <SiteHeader active="help" />
      <main className="evidence-page page-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/troubleshooting">Troubleshooting</Link></li>
            <li aria-current="page">{guide.h1}</li>
          </ol>
        </nav>
        <article className="evidence-page__article">
          <div className="evidence-page__illustration" aria-hidden="true"><RadioIcon /></div>
          <p className="verification-status" role="status">{guide.verificationLabel}</p>
          <p className="guide-kicker">SYMPTOM-FIRST TROUBLESHOOTING</p>
          <h1>{guide.h1}</h1>
          <p className="evidence-page__lede">{guide.description}</p>

          <section className="hint-block" aria-labelledby="quick-answer">
            <p className="hint-block__kicker">QUICK ANSWER</p>
            <h2 id="quick-answer">Start here</h2>
            <p>{guide.summary}</p>
          </section>

          <section className="guide-steps" aria-labelledby="quick-checks">
            <h2 id="quick-checks">Quick checks</h2>
            <ol>
              {guide.quickChecks.map((check) => <li key={check}>{check}</li>)}
            </ol>
          </section>

          <section className="route-recovery" aria-labelledby="diagnostic-path">
            <h2 id="diagnostic-path">Diagnostic path</h2>
            <div className="route-recovery__table-wrap">
              <table>
                <thead><tr><th>Check</th><th>What to do</th><th>Why it matters</th></tr></thead>
                <tbody>
                  {guide.diagnosticSteps.map((step) => (
                    <tr key={step.title}>
                      <th scope="row">{step.title}</th>
                      <td>{step.action}</td>
                      <td>{step.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="verification-panel" aria-labelledby="evidence-boundary">
            <h2 id="evidence-boundary">Evidence boundary</h2>
            <p>
              This page remains <strong>noindex, follow</strong>. Official or publisher-attributed behavior is separated
              from community symptoms, and no community workaround is presented as a confirmed universal fix.
            </p>
            <h3>What still needs first-hand verification</h3>
            <ul className="evidence-checklist">
              {guide.evidenceNeeds.map((need) => <li key={need}>{need}</li>)}
            </ul>
            <div className="guide-sources">
              <h3>Source links and limits</h3>
              <ul>{guide.sources.map(sourceBoundary)}</ul>
            </div>
          </section>

          <section className="related-guides" aria-labelledby="related-troubleshooting">
            <h2 id="related-troubleshooting">Related troubleshooting</h2>
            <ul>
              <li><Link href="/troubleshooting">Choose a different symptom</Link></li>
              {guide.relatedSlugs.map((slug) => {
                const related = troubleshootingBySlug(slug);
                return related ? <li key={slug}><Link href={`/troubleshooting/${slug}`}>{related.h1}</Link></li> : null;
              })}
            </ul>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

export function TroubleshootingHub() {
  const page = siteSectionBySlug('troubleshooting')!;
  const crossplay = siteSectionBySlug('troubleshooting/crossplay-switch-2')!;
  const url = `${site.url}/troubleshooting`;
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.h1,
    description: page.description,
    url,
    hasPart: troubleshootingGuides.map((guide) => ({
      '@type': 'Article',
      name: guide.h1,
      url: `${url}/${guide.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={collection} />
      <SiteHeader active="help" />
      <main className="evidence-page page-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol><li><Link href="/">Home</Link></li><li aria-current="page">Troubleshooting</li></ol>
        </nav>
        <article className="evidence-page__article">
          <div className="evidence-page__illustration" aria-hidden="true"><MapIcon /></div>
          <p className="verification-status" role="status">Symptom router — evidence still in progress</p>
          <p className="guide-kicker">BIG WALK HELP</p>
          <h1>{page.h1}</h1>
          <p className="evidence-page__lede">Choose the point where the problem occurs. The pages below keep platform checks, product behavior, and community reports separate.</p>

          <section className="hint-block" aria-labelledby="before-you-start">
            <p className="hint-block__kicker">BEFORE YOU START</p>
            <h2 id="before-you-start">Record four facts</h2>
            <p>Platform, current game build, host or joiner role, and the last screen or action before the failure. These four facts prevent different problems from being merged into one generic “not working” report.</p>
          </section>

          <section className="evidence-page__available" aria-labelledby="choose-symptom">
            <h2 id="choose-symptom">Choose your symptom</h2>
            <div className="evidence-route-grid">
              {troubleshootingGuides.map((guide) => (
                <article className="evidence-route-card" key={guide.slug}>
                  <p className="guide-card-category">DIAGNOSTIC PAGE</p>
                  <h3><Link href={`/troubleshooting/${guide.slug}`}>{guide.h1}</Link></h3>
                  <p>{guide.description}</p>
                  <p className="guide-card-meta">Noindex while fixes are being verified</p>
                </article>
              ))}
              <article className="evidence-route-card">
                <p className="guide-card-category">PLATFORM CHECK</p>
                <h3><Link href={`/${crossplay.slug}`}>{crossplay.h1}</Link></h3>
                <p>{crossplay.description}</p>
                <p className="guide-card-meta">Awaiting official or first-hand confirmation</p>
              </article>
            </div>
          </section>

          <section className="verification-panel" aria-labelledby="hub-evidence">
            <h2 id="hub-evidence">Why these pages stay out of search for now</h2>
            <p>They provide safe diagnostic structure, but a reproducible current-version result is still missing for the proposed Big Walk-specific recoveries. The pages remain noindex until that evidence exists.</p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

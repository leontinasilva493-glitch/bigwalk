import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialArtwork } from './editorial-artwork';
import { JsonLd } from './json-ld';
import { PrimarySources } from './primary-sources';
import { SiteFooter, SiteHeader } from './site';
import { RadioIcon } from './game-elements';
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

          {'symptomRows' in guide && guide.symptomRows?.length ? (
            <section className="route-recovery" aria-labelledby="symptom-router">
              <p className="hint-block__kicker">NAME THE FAILURE</p>
              <h2 id="symptom-router">{'symptomHeading' in guide ? guide.symptomHeading : 'Where does connection fail?'}</h2>
              <div className="route-recovery__table-wrap">
                <table>
                  <thead><tr><th>Symptom</th><th>Likely boundary</th><th>Next step</th></tr></thead>
                  <tbody>{guide.symptomRows.map((row) => <tr key={row.symptom}><th scope="row">{row.symptom}</th><td>{row.likelyBoundary}</td><td>{row.nextStep}</td></tr>)}</tbody>
                </table>
              </div>
              <div className="route-recovery__mobile-list">
                {guide.symptomRows.map((row) => <details className="route-recovery__mobile-card" key={row.symptom}><summary>{row.symptom}</summary><p><strong>Likely boundary:</strong> {row.likelyBoundary}</p><p><strong>Next step:</strong> {row.nextStep}</p></details>)}
              </div>
            </section>
          ) : null}

          {'platformChecks' in guide && guide.platformChecks?.length ? (
            <section className="route-recovery" aria-labelledby="platform-checks">
              <p className="hint-block__kicker">USE THE MATCHING DEVICE PATH</p>
              <h2 id="platform-checks">Platform-specific checks</h2>
              <div className="route-recovery__table-wrap">
                <table>
                  <thead><tr><th>Platform</th><th>Symptom</th><th>Official check</th><th>Evidence</th></tr></thead>
                  <tbody>{guide.platformChecks.map((row) => <tr key={`${row.platform}-${row.symptom}`}><th scope="row">{row.platform}</th><td>{row.symptom}</td><td>{row.check}</td><td><span className="evidence-label">{row.evidence}</span></td></tr>)}</tbody>
                </table>
              </div>
              <div className="route-recovery__mobile-list">
                {guide.platformChecks.map((row) => <details className="route-recovery__mobile-card" key={`${row.platform}-${row.symptom}`}><summary>{row.platform}: {row.symptom}</summary><p>{row.check}</p><p><span className="evidence-label">{row.evidence}</span></p></details>)}
              </div>
            </section>
          ) : null}

          <section className="route-recovery" aria-labelledby="diagnostic-path">
            <h2 id="diagnostic-path">Diagnostic path</h2>
            <div className="route-recovery__table-wrap">
              <table>
                <thead><tr><th>Check</th><th>Evidence</th><th>What to do</th><th>Why it matters</th></tr></thead>
                <tbody>
                  {guide.diagnosticSteps.map((step) => (
                    <tr key={step.title}>
                      <th scope="row">{step.title}</th>
                      <td><span className="evidence-label">{step.evidence}</span></td>
                      <td>{step.action}</td>
                      <td>{step.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="route-recovery__mobile-list">
              {guide.diagnosticSteps.map((step) => (
                <details className="route-recovery__mobile-card" key={step.title}>
                  <summary>{step.title}</summary>
                  <p><span className="evidence-label">{step.evidence}</span></p>
                  <p><strong>What to do:</strong> {step.action}</p>
                  <p><strong>Why it matters:</strong> {step.reason}</p>
                </details>
              ))}
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
          <PrimarySources sources={guide.sources} headingId="troubleshooting-primary-sources-heading" />
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
    primaryImageOfPage: `${site.url}/images/editorial/big-walk-troubleshooting-help-fixes-guide.webp`,
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
          <header className="guide-hero editorial-page-hero">
            <div className="editorial-page-hero__copy">
              <p className="guide-kicker">BIG WALK HELP</p>
              <h1>{page.h1}</h1>
              <p className="evidence-page__lede">Choose the point where the problem occurs. The pages below keep platform checks, product behavior, and community reports separate.</p>
            </div>
            <EditorialArtwork
              src="/images/editorial/big-walk-troubleshooting-help-fixes-guide.webp"
              alt="Big Walk troubleshooting help scene with explorers checking voice chat, reconnect, and startup paths"
              variant="troubleshooting"
              placement="hero"
              preload
            />
          </header>

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
                  <p className="guide-card-meta">Symptom-specific diagnostic guide</p>
                </article>
              ))}
              <article className="evidence-route-card">
                <p className="guide-card-category">PLATFORM CHECK</p>
                <h3><Link href={`/${crossplay.slug}`}>{crossplay.h1}</Link></h3>
                <p>{crossplay.description}</p>
                <p className="guide-card-meta">Official platform list and source notes</p>
              </article>
            </div>
          </section>

        </article>
      </main>
      <SiteFooter />
    </>
  );
}

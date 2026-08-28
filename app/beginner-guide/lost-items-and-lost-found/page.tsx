import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '../../../components/json-ld';
import { PrimarySources } from '../../../components/primary-sources';
import { SiteFooter, SiteHeader } from '../../../components/site';
import { site } from '../../../lib/content.mjs';
import { lostItemsGuide as guide } from '../../../lib/lost-items-content.mjs';

export const metadata: Metadata = {
  title: { absolute: guide.title },
  description: guide.description,
  alternates: { canonical: `/${guide.slug}` },
  robots: { index: false, follow: true },
  openGraph: { url: `/${guide.slug}`, title: guide.title, description: guide.description },
  twitter: { card: 'summary', title: guide.title, description: guide.description },
};

export default function LostItemsPage() {
  const url = `${site.url}/${guide.slug}`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.h1,
    description: guide.description,
    dateModified: guide.sourceCheckedAt,
    mainEntityOfPage: url,
    publisher: { '@type': 'Organization', name: site.name },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Beginner Guide', item: `${site.url}/beginner-guide` },
      { '@type': 'ListItem', position: 3, name: guide.h1, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <SiteHeader active="beginner" />
      <main className="evidence-page page-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/beginner-guide">Beginner Guide</Link></li>
            <li aria-current="page">Lost items</li>
          </ol>
        </nav>

        <article className="evidence-page__article">
          <p className="guide-kicker">LOST ITEM RECOVERY · LINKED SOURCES</p>
          <h1>{guide.h1}</h1>
          <p className="evidence-page__lede">{guide.description}</p>
          <p className="guide-meta">Game version context: {guide.gameVersion} · Updated {guide.sourceCheckedAt}</p>

          <section className="hint-block" aria-labelledby="lost-items-quick-answer">
            <p className="hint-block__kicker">QUICK ANSWER</p>
            <h2 id="lost-items-quick-answer">Where should you look first?</h2>
            <p>{guide.quickAnswer}</p>
          </section>

          <section className="route-recovery" aria-labelledby="item-state-heading">
            <p className="hint-block__kicker">IDENTIFY THE STATE</p>
            <h2 id="item-state-heading">What kind of item is missing?</h2>
            <div className="route-recovery__table-wrap">
              <table>
                <thead><tr><th>Situation</th><th>First check</th><th>Current evidence</th><th>Limit</th></tr></thead>
                <tbody>
                  {guide.scenarios.map((scenario) => (
                    <tr key={scenario.situation}>
                      <th scope="row">{scenario.situation}</th>
                      <td>{scenario.firstCheck}</td>
                      <td>{scenario.currentEvidence}</td>
                      <td>{scenario.boundary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="route-recovery__mobile-list">
              {guide.scenarios.map((scenario) => (
                <details className="route-recovery__mobile-card" key={scenario.situation}>
                  <summary>{scenario.situation}</summary>
                  <p><strong>First check:</strong> {scenario.firstCheck}</p>
                  <p><strong>Current evidence:</strong> {scenario.currentEvidence}</p>
                  <p><strong>Limit:</strong> {scenario.boundary}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="guide-steps" aria-labelledby="safe-recovery-heading">
            <p className="hint-block__kicker">ONE CHANGE AT A TIME</p>
            <h2 id="safe-recovery-heading">Safe recovery order</h2>
            <ol className="solution-steps">
              {guide.recoverySteps.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{step.title}</h3><p>{step.body}</p><p><span className="evidence-label">{step.evidence}</span></p></div>
                </li>
              ))}
            </ol>
          </section>

          <section className="evidence-page__available" aria-labelledby="map-room-state-heading">
            <p className="hint-block__kicker">MAP ROOM CROSS-CHECK</p>
            <h2 id="map-room-state-heading">What the marker can and cannot tell you</h2>
            <div className="evidence-route-grid">
              {guide.mapRoomStates.map((state) => <article className="evidence-route-card" key={state.label}><h3>{state.label}</h3><p>{state.meaning}</p></article>)}
            </div>
            <p><Link href="/map">Open the spoiler-controlled Big Walk map →</Link></p>
          </section>

          <section className="related-guides" aria-labelledby="lost-items-related-heading">
            <h2 id="lost-items-related-heading">Continue from the right problem</h2>
            <ul>
              <li><Link href="/multiplayer/hosting-and-saves">Hosting and saves</Link></li>
              <li><Link href="/troubleshooting/save-corrupted-or-missing">Save corrupted or missing</Link></li>
              <li><Link href="/puzzles">Puzzle directory</Link></li>
              <li><Link href="/map">Interactive map</Link></li>
            </ul>
          </section>
          <PrimarySources sources={guide.sources} headingId="lost-items-primary-sources-heading" />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

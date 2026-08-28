import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '../../../components/json-ld';
import { SiteFooter, SiteHeader } from '../../../components/site';
import { site } from '../../../lib/content.mjs';
import { hostingSavesGuide as guide } from '../../../lib/hosting-saves-content.mjs';

export const metadata: Metadata = {
  title: { absolute: guide.title },
  description: guide.description,
  alternates: { canonical: `/${guide.slug}` },
  robots: { index: false, follow: true },
  openGraph: { url: `/${guide.slug}`, title: guide.title, description: guide.description },
  twitter: { card: 'summary', title: guide.title, description: guide.description },
};

export default function HostingAndSavesPage() {
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
      { '@type': 'ListItem', position: 2, name: 'Multiplayer', item: `${site.url}/multiplayer` },
      { '@type': 'ListItem', position: 3, name: guide.h1, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <SiteHeader active="multiplayer" />
      <main className="evidence-page page-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li><Link href="/multiplayer">Multiplayer</Link></li><li aria-current="page">Hosting and saves</li></ol></nav>
        <article className="evidence-page__article">
          <p className="guide-kicker">HOST · JOIN · RETURN</p>
          <h1>{guide.h1}</h1>
          <p className="evidence-page__lede">{guide.description}</p>
          <p className="guide-meta">Game version context: {guide.gameVersion} · Sources checked {guide.sourceCheckedAt} · Noindex until current cross-session item captures are available</p>

          <section className="hint-block" aria-labelledby="hosting-quick-answer">
            <p className="hint-block__kicker">QUICK ANSWER</p>
            <h2 id="hosting-quick-answer">Who owns the save?</h2>
            <p>{guide.quickAnswer}</p>
          </section>

          <section className="route-recovery" aria-labelledby="official-rules-heading">
            <p className="hint-block__kicker">OFFICIAL RULES</p>
            <h2 id="official-rules-heading">What House House confirms</h2>
            <div className="route-recovery__table-wrap"><table><thead><tr><th>Rule</th><th>What it means</th><th>Source type</th></tr></thead><tbody>{guide.officialRules.map((rule) => <tr key={rule.rule}><th scope="row">{rule.rule}</th><td>{rule.detail}</td><td><span className="evidence-label">{rule.source}</span></td></tr>)}</tbody></table></div>
            <div className="route-recovery__mobile-list">{guide.officialRules.map((rule) => <details className="route-recovery__mobile-card" key={rule.rule}><summary>{rule.rule}</summary><p>{rule.detail}</p><p><span className="evidence-label">{rule.source}</span></p></details>)}</div>
          </section>

          <section className="guide-steps" aria-labelledby="session-checklist-heading">
            <p className="hint-block__kicker">RETURNING GROUP CHECKLIST</p>
            <h2 id="session-checklist-heading">Before starting a session</h2>
            <ol className="solution-steps">{guide.sessionSteps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol>
          </section>

          <section className="route-recovery" aria-labelledby="persistence-heading">
            <p className="hint-block__kicker">STATE BETWEEN SESSIONS</p>
            <h2 id="persistence-heading">What persists between sessions?</h2>
            <div className="route-recovery__table-wrap"><table><thead><tr><th>State</th><th>Evidence</th><th>Current answer</th></tr></thead><tbody>{guide.persistenceRows.map((row) => <tr key={row.state}><th scope="row">{row.state}</th><td><span className="evidence-label">{row.evidence}</span></td><td>{row.persists}</td></tr>)}</tbody></table></div>
            <div className="route-recovery__mobile-list">{guide.persistenceRows.map((row) => <details className="route-recovery__mobile-card" key={row.state}><summary>{row.state}</summary><p><span className="evidence-label">{row.evidence}</span></p><p>{row.persists}</p></details>)}</div>
          </section>

          <section className="verification-panel" aria-labelledby="hosting-sources-heading">
            <h2 id="hosting-sources-heading">Sources and unresolved limits</h2>
            <p>{guide.evidenceNote}</p>
            <div className="guide-sources"><ul>{guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> <span>— {source.publisher}</span><p>{source.note}</p></li>)}</ul></div>
          </section>

          <section className="related-guides" aria-labelledby="hosting-related-heading">
            <h2 id="hosting-related-heading">Continue from the current symptom</h2>
            <ul>
              <li><Link href="/beginner-guide/lost-items-and-lost-found">Recover a missing item or reward</Link></li>
              <li><Link href="/troubleshooting/cant-connect-or-join">Cannot connect or rejoin</Link></li>
              <li><Link href="/troubleshooting/save-corrupted-or-missing">Save corrupted or missing</Link></li>
              <li><Link href="/multiplayer/how-to-find-players">Find a compatible group</Link></li>
            </ul>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

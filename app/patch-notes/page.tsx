import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '../../components/json-ld';
import { SiteFooter, SiteHeader } from '../../components/site';
import { site } from '../../lib/content.mjs';
import { currentVersion, updates, updateSources } from '../../lib/updates-content.mjs';
import { buildArticleJsonLd } from '../../lib/article-json-ld.mjs';

const title = 'Big Walk Patch Notes — Current Version & Update History';
const description = 'Check the current Big Walk version, official patch notes, update history, and what each network, voice, save, and settings change means for your group.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/patch-notes' },
  robots: { index: true, follow: true },
  openGraph: { url: '/patch-notes', title, description },
  twitter: { card: 'summary', title, description },
};

export default function PatchNotesPage() {
  const url = `${site.url}/patch-notes`;
  const article = buildArticleJsonLd({
    site,
    headline: title,
    description,
    datePublished: currentVersion.pagePublishedAt,
    dateModified: currentVersion.checkedAt,
    url,
  });
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Patch Notes', item: url },
    ],
  };

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <SiteHeader />
      <main className="guide-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol><li><Link href="/">Home</Link></li><li aria-current="page">Patch Notes</li></ol>
        </nav>
        <article className="guide-article update-history">
          <header className="guide-hero update-history__hero">
            <p className="guide-kicker">CURRENT VERSION &amp; PATCH NOTES</p>
            <h1>Big Walk Patch Notes</h1>
            <p className="guide-description">{description}</p>
            <div className="current-version-card">
              <span>Current official version</span>
              <strong>{currentVersion.version}</strong>
              <p>{currentVersion.summary}</p>
              <a href={currentVersion.officialUrl} target="_blank" rel="noreferrer">Open the official Version History</a>
            </div>
          </header>

          <section className="answer-first-quick" aria-labelledby="update-today-heading">
            <p className="hint-block__kicker">QUICK ANSWER</p>
            <h2 id="update-today-heading">Was Big Walk updated today?</h2>
            <p>{currentVersion.directAnswer}</p>
            <ul className="compact-facts">{currentVersion.conditions.map((condition) => <li key={condition}>{condition}</li>)}</ul>
            <p className="guide-sources__updated">
              <strong>Official evidence checked {currentVersion.checkedAt}:</strong>{' '}
              <a href={currentVersion.officialUrl} target="_blank" rel="noreferrer">Version History</a>{' · '}
              <a href={currentVersion.faqUrl} target="_blank" rel="noreferrer">version compatibility FAQ</a>
            </p>
          </section>

          <section aria-labelledby="compatibility-heading">
            <p className="hint-block__kicker">BEFORE REINSTALLING</p>
            <h2 id="compatibility-heading">Check version compatibility first</h2>
            <p>Only the first two version numbers need to match for players to join one another. For example, 1.4.9 and 1.4.10 are compatible; 1.4.x and 1.5.x are not. This rule comes from the official FAQ.</p>
          </section>

          <section aria-labelledby="timeline-heading">
            <p className="hint-block__kicker">OFFICIAL UPDATE TIMELINE</p>
            <h2 id="timeline-heading">What changed in each version</h2>
            <div className="update-timeline">
              {updates.map((update) => (
                <article className="update-entry" id={`version-${update.version.replaceAll('.', '-')}`} key={update.version}>
                  <div className="update-entry__meta"><strong>Version {update.version}</strong><span>{update.releaseDate ?? `Official history checked ${currentVersion.checkedAt}`}</span></div>
                  <h3>{update.label}</h3>
                  <ul>{update.changes.map((change) => <li key={change}>{change}</li>)}</ul>
                  <p><strong>What this means:</strong> {update.playerImpact}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="route-recovery" aria-labelledby="after-update-heading">
            <p className="hint-block__kicker">IF THE PROBLEM CONTINUES</p>
            <h2 id="after-update-heading">After updating, test from the host outward</h2>
            <ol>
              <li>Fully restart Big Walk on the host and every joining device.</li>
              <li>Confirm the host is loaded into the intended save before anyone joins.</li>
              <li>Use the current Join Code and required Session Password.</li>
              <li>Copy the exact host/join warning introduced in 1.4.10.</li>
              <li>Use the <Link href="/troubleshooting">symptom-first troubleshooting router</Link> instead of repeatedly rebuilding the lobby.</li>
            </ol>
          </section>

          <section className="guide-sources" aria-labelledby="update-sources-heading">
            <h2 id="update-sources-heading">Official sources</h2>
            <ul>{updateSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> <span>— {source.publisher}</span><p>{source.purpose}</p></li>)}</ul>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

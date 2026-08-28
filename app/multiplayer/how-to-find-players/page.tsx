import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialArtwork } from '../../../components/editorial-artwork';
import { JsonLd } from '../../../components/json-ld';
import { SiteFooter, SiteHeader } from '../../../components/site';
import { site, siteSectionBySlug } from '../../../lib/content.mjs';
import { lfgGuide } from '../../../lib/lfg-content.mjs';

const page = siteSectionBySlug('multiplayer/how-to-find-players')!;

const relatedPages = [
  { href: '/multiplayer', title: 'Big Walk multiplayer guide' },
  { href: '/multiplayer/best-group-size', title: 'Best group size' },
  { href: '/multiplayer/hosting-and-saves', title: 'Hosting and saves' },
];

export const metadata: Metadata = {
  title: { absolute: page.title },
  description: page.description,
  alternates: { canonical: `/${page.slug}` },
  robots: { index: true, follow: true },
  openGraph: {
    url: `/${page.slug}`,
    title: page.title,
    description: page.description,
    images: [{
      url: '/images/editorial/big-walk-find-players-lfg-guide.webp',
      width: 1536,
      height: 1024,
      alt: 'Big Walk find players LFG guide scene with four trail explorers planning a co-op group around a map',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: page.title,
    description: page.description,
    images: ['/images/editorial/big-walk-find-players-lfg-guide.webp'],
  },
};

export default function FindPlayersPage() {
  const url = `${site.url}/${page.slug}`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.description,
    dateModified: lfgGuide.lastChecked,
    mainEntityOfPage: url,
    image: `${site.url}/images/editorial/big-walk-find-players-lfg-guide.webp`,
    publisher: { '@type': 'Organization', name: site.name },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Multiplayer', item: `${site.url}/multiplayer` },
      { '@type': 'ListItem', position: 3, name: page.h1, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <SiteHeader active="multiplayer" />
      <main className="guide-page lfg-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/multiplayer">Multiplayer</Link></li>
            <li aria-current="page">Find players</li>
          </ol>
        </nav>

        <article className="guide-article">
          <header className="guide-hero editorial-page-hero">
            <div className="editorial-page-hero__copy">
              <p className="guide-kicker">BIG WALK LFG</p>
              <h1>{page.h1}</h1>
              <p className="guide-description">
                Big Walk has no public matchmaking. Find teammates in the current Reddit LFG thread or Steam Discussions, then exchange a private Join Code and Session Password after checking version, host, and group fit.
              </p>
              <p className="guide-meta">Community directory / LFG / Version context: {lfgGuide.gameVersion} / Last checked: {lfgGuide.lastChecked}</p>
            </div>
            <EditorialArtwork
              src="/images/editorial/big-walk-find-players-lfg-guide.webp"
              alt="Big Walk find players LFG guide scene with four trail explorers planning a co-op group around a map"
              variant="lfg"
              placement="hero"
              preload
            />
          </header>

          <section className="lfg-section" aria-labelledby="active-lfg-heading">
            <p className="hint-block__kicker">WHERE PLAYERS ARE POSTING</p>
            <h2 id="active-lfg-heading">Active LFG channels</h2>
            <div className="lfg-channel-grid">
              {lfgGuide.channels.map((channel) => (
                <article className="lfg-channel-card" key={channel.name}>
                  <h3>{channel.name}</h3>
                  <dl>
                    <div>
                      <dt>Link</dt>
                      <dd><a href={channel.href} target="_blank" rel="noreferrer">{channel.linkLabel}</a></dd>
                    </div>
                    <div>
                      <dt>Last checked</dt>
                      <dd><time dateTime={lfgGuide.lastChecked}>{lfgGuide.lastChecked}</time></dd>
                    </div>
                    <div>
                      <dt>Activity</dt>
                      <dd>{channel.activity}</dd>
                    </div>
                  </dl>
                  {'fallbackHref' in channel ? <p><a href={channel.fallbackHref} target="_blank" rel="noreferrer">Open r/BigWalk if the daily thread has rolled over</a></p> : null}
                </article>
              ))}
            </div>
          </section>

          <section className="lfg-section" aria-labelledby="group-fit-heading">
            <p className="hint-block__kicker">MATCH BEFORE YOU JOIN</p>
            <h2 id="group-fit-heading">Choose a compatible group</h2>
            <div className="route-recovery__table-wrap"><table><thead><tr><th>Topic</th><th>Match on</th><th>Why it matters</th></tr></thead><tbody>{lfgGuide.fitRows.map((row) => <tr key={row.topic}><th scope="row">{row.topic}</th><td>{row.matchOn}</td><td>{row.why}</td></tr>)}</tbody></table></div>
            <div className="route-recovery__mobile-list">{lfgGuide.fitRows.map((row) => <details className="route-recovery__mobile-card" key={row.topic}><summary>{row.topic}</summary><p><strong>Match on:</strong> {row.matchOn}</p><p>{row.why}</p></details>)}</div>
          </section>

          <section className="lfg-section lfg-posting" aria-labelledby="posting-template-heading">
            <p className="hint-block__kicker">COPY, FILL, POST</p>
            <h2 id="posting-template-heading">Safe posting template</h2>
            <p>Include enough detail to find a compatible group without publishing contact details or a live room code.</p>
            <ul className="lfg-field-list">
              {lfgGuide.postingFields.map((field) => <li key={field}>{field}</li>)}
            </ul>
            <h3>Filled example</h3>
            <pre><code>{lfgGuide.postingExample}</code></pre>
          </section>

          <section className="lfg-section guide-steps" aria-labelledby="private-handoff-heading">
            <p className="hint-block__kicker">CURRENT CREDENTIALS ONLY</p>
            <h2 id="private-handoff-heading">Private join handoff</h2>
            <ol className="solution-steps">{lfgGuide.safeJoinSteps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol>
          </section>

          <section className="lfg-section lfg-safety" aria-labelledby="safety-notes-heading">
            <p className="hint-block__kicker">BEFORE YOU POST</p>
            <h2 id="safety-notes-heading">Safety notes</h2>
            <ul>
              <li><strong>If you are under 18:</strong> do not post your exact age, school, location, real name, contact details, or other personal information in a public LFG thread. Use a broad group preference instead.</li>
              <li><strong>Keep the Join Code private:</strong> agree on the group first, then send the room code by direct message rather than leaving it in a public post.</li>
              <li><strong>Treat public Discord links as untrusted:</strong> the current r/BigWalk LFG thread does not allow public server links, and a Steam forum PSA warns about invite scams. Do not sign in through an unfamiliar invite or give anyone your Steam credentials.</li>
              <li><strong>Set boundaries:</strong> state your spoiler preference, block or report harassment, and leave any group that ignores your limits.</li>
            </ul>
          </section>

          <section className="guide-sources" aria-labelledby="lfg-sources-heading">
            <h2 id="lfg-sources-heading">Official rules and current community channels</h2>
            <ul>{lfgGuide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> <span>— {source.publisher}</span><p>{source.note}</p></li>)}</ul>
          </section>

          <section className="related-guides" aria-labelledby="lfg-related-heading">
            <h2 id="lfg-related-heading">Related pages</h2>
            <ul>
              {relatedPages.map((related) => <li key={related.href}><Link href={related.href}>{related.title}</Link></li>)}
            </ul>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '../../../components/json-ld';
import { SiteFooter, SiteHeader } from '../../../components/site';
import { site, siteSectionBySlug } from '../../../lib/content.mjs';

const page = siteSectionBySlug('multiplayer/how-to-find-players')!;
const lastChecked = '2026-08-14';

const channels = [
  {
    name: 'Reddit r/BigWalk daily LFG Megathread',
    href: 'https://www.reddit.com/r/BigWalk/comments/1vn1bdo/looking_for_group_megathread_13_august_2026/',
    linkLabel: 'Looking for Group Megathread (13 August 2026)',
    activity: 'Active on check: the daily thread was receiving new group requests and replies. If this dated thread is closed, use the newest pinned LFG thread on r/BigWalk.',
  },
  {
    name: 'Steam Discussions — Looking for Group board',
    href: 'https://steamcommunity.com/app/1478500/discussions/',
    linkLabel: 'Open Big Walk Steam Discussions',
    activity: 'Highest observed activity: about 54 of 60 recently active topics in the checked sample were player-finding posts, with new topics appearing within minutes.',
  },
  {
    name: 'Community Discord',
    label: 'UNOFFICIAL — not run by the developers',
    href: 'https://discord.com/invite/Xmqf4cGA9G',
    linkLabel: 'Open the Big Walk Community invite',
    activity: 'Available on check: the invite resolved and was linked from the r/BigWalk community bookmarks. Live member activity was not independently measured.',
  },
];

const postingFields = ['Platform', 'Region', 'Language', 'Age range', 'Mic preference', 'Current progress', 'Goal'];

const postingExample = `Platform: PC / Mac
Region: Europe (UTC+2)
Language: English
Age range: 18+
Mic preference: Mic preferred, text okay
Current progress: Fresh world
Goal: Relaxed, spoiler-light first playthrough`;

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
  openGraph: { url: `/${page.slug}`, title: page.title, description: page.description },
  twitter: { card: 'summary', title: page.title, description: page.description },
};

export default function FindPlayersPage() {
  const url = `${site.url}/${page.slug}`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.description,
    dateModified: lastChecked,
    mainEntityOfPage: url,
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
          <header className="guide-hero">
            <p className="verification-status" role="status">Source-checked directory</p>
            <p className="guide-kicker">BIG WALK LFG</p>
            <h1>{page.h1}</h1>
            <p className="guide-description">
              Big Walk has no public matchmaking. You find teammates through community LFG spaces and join with a private Join Code — this page lists the active ones, when they were last checked, and how to post safely.
            </p>
            <p className="guide-meta">Community directory / LFG / Last checked: {lastChecked}</p>
          </header>

          <section className="lfg-section" aria-labelledby="active-lfg-heading">
            <p className="hint-block__kicker">WHERE PLAYERS ARE POSTING</p>
            <h2 id="active-lfg-heading">Active LFG channels</h2>
            <div className="lfg-channel-grid">
              {channels.map((channel) => (
                <article className="lfg-channel-card" key={channel.name}>
                  {channel.label ? <p className="evidence-label">{channel.label}</p> : null}
                  <h3>{channel.name}</h3>
                  <dl>
                    <div>
                      <dt>Link</dt>
                      <dd><a href={channel.href} target="_blank" rel="noreferrer">{channel.linkLabel}</a></dd>
                    </div>
                    <div>
                      <dt>Last checked</dt>
                      <dd><time dateTime={lastChecked}>{lastChecked}</time></dd>
                    </div>
                    <div>
                      <dt>Activity</dt>
                      <dd>{channel.activity}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <section className="lfg-section lfg-posting" aria-labelledby="posting-template-heading">
            <p className="hint-block__kicker">COPY, FILL, POST</p>
            <h2 id="posting-template-heading">Safe posting template</h2>
            <p>Include enough detail to find a compatible group without publishing contact details or a live room code.</p>
            <ul className="lfg-field-list">
              {postingFields.map((field) => <li key={field}>{field}</li>)}
            </ul>
            <h3>Filled example</h3>
            <pre><code>{postingExample}</code></pre>
          </section>

          <section className="lfg-section lfg-safety" aria-labelledby="safety-notes-heading">
            <p className="hint-block__kicker">BEFORE YOU POST</p>
            <h2 id="safety-notes-heading">Safety notes</h2>
            <ul>
              <li><strong>If you are under 18:</strong> do not post your exact age, school, location, real name, contact details, or other personal information in a public LFG thread. Use a broad group preference instead.</li>
              <li><strong>Keep the Join Code private:</strong> agree on the group first, then send the room code by direct message rather than leaving it in a public post.</li>
              <li><strong>Set boundaries:</strong> state your spoiler preference, block or report harassment, and leave any group that ignores your limits.</li>
            </ul>
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

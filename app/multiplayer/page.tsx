import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '../../components/json-ld';
import { SiteFooter, SiteHeader } from '../../components/site';
import { site } from '../../lib/content.mjs';

const lastChecked = '2026-08-11';

const title = 'Big Walk Crossplay, Couch Co-op & Platforms Explained';
const description =
  'Does Big Walk have crossplay, couch co-op, or split-screen? Which platforms is it on? Cross-platform play, join codes, and platform availability - verified.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/multiplayer' },
  robots: { index: true, follow: true },
  openGraph: { url: '/multiplayer', title, description },
  twitter: { card: 'summary', title, description },
};

const platforms = [
  { platform: 'Windows PC', available: 'Yes', notes: `Steam version; crossplay supported. Last checked: ${lastChecked}.` },
  { platform: 'Mac', available: 'Yes', notes: `Steam and Mac App Store versions listed by the official FAQ. Last checked: ${lastChecked}.` },
  { platform: 'PlayStation 5', available: 'Yes', notes: `PS5 version; online play uses the supported platform service. Last checked: ${lastChecked}.` },
  { platform: 'Nintendo Switch 2', available: 'Yes', notes: `Switch 2 version; original Switch is not listed. Last checked: ${lastChecked}.` },
  { platform: 'Original Switch', available: 'No', notes: `House House lists Nintendo Switch 2 only. Last checked: ${lastChecked}.` },
  { platform: 'Xbox', available: 'No', notes: `House House says no other platforms are planned. Last checked: ${lastChecked}.` },
];

const sources = [
  { title: 'Big Walk FAQ', publisher: 'House House', url: 'https://bigwalk.game/faq/' },
  { title: 'Does Big Walk have crossplay?', publisher: 'GamesRadar+', url: 'https://www.gamesradar.com/games/co-op/big-walk-crossplay-matchmaking/' },
  { title: 'Big Walk Platforms and Crossplay Explained', publisher: 'G2A News', url: 'https://www.g2a.com/news/features/big-walk-platforms-and-crossplay-explained/' },
  { title: 'Is Big Walk cross-play?', publisher: 'RadioTimes', url: 'https://www.radiotimes.com/technology/gaming/is-big-walk-cross-play-explained/' },
];

export default function MultiplayerPage() {
  const url = `${site.url}/multiplayer`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Big Walk Multiplayer: Crossplay, Platforms & Co-op',
    description,
    dateModified: lastChecked,
    mainEntityOfPage: url,
    publisher: { '@type': 'Organization', name: site.name },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Multiplayer', item: url },
    ],
  };

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <SiteHeader active="multiplayer" />
      <main className="guide-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol><li><Link href="/">Home</Link></li><li aria-current="page">Multiplayer</li></ol>
        </nav>
        <article className="guide-article">
          <section className="guide-hero">
            <p className="verification-status">Source-checked guide</p>
            <p className="guide-kicker">MULTIPLAYER GUIDE</p>
            <h1>Big Walk Multiplayer: Crossplay, Platforms & Co-op</h1>
            <p className="guide-description">{description}</p>
            <p className="guide-meta">Official FAQ / cross-platform play / couch co-op / Xbox and Switch status / Last checked: {lastChecked}</p>
          </section>

          <section className="route-overview" aria-labelledby="compatibility-table">
            <p className="hint-block__kicker">Quick compatibility table</p>
            <h2 id="compatibility-table">Where Big Walk is available</h2>
            <div className="table-wrap">
              <table className="guide-table">
                <thead><tr><th>Platform</th><th>Available?</th><th>Notes</th></tr></thead>
                <tbody>
                  {platforms.map((row) => (
                    <tr key={row.platform}>
                      <th scope="row">{row.platform}</th>
                      <td>{row.available}</td>
                      <td>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="guide-section" aria-labelledby="crossplay">
            <h2 id="crossplay">Does Big Walk Support Crossplay?</h2>
            <p>
              Yes. The official FAQ says players on different systems can play together, and current third-party
              coverage agrees that PC/Mac, PS5, and Nintendo Switch 2 can join the same online session.
            </p>
            <ul className="check-list">
              <li>PS5 to PC/Mac: supported.</li>
              <li>PS5 to Switch 2: supported.</li>
              <li>PC/Mac to Switch 2: supported.</li>
              <li>Cross-platform joins use a Join Code when a platform friends list is not enough.</li>
            </ul>
          </section>

          <section className="guide-section" aria-labelledby="couch-coop">
            <h2 id="couch-coop">Does Big Walk Have Couch Co-op or Split-Screen?</h2>
            <p>
              No shared-screen or split-screen mode is listed. Big Walk is built around separate devices and in-game
              communication. The same-house workaround is separate devices in separate rooms, because same-room voices
              can bypass the game&apos;s voice-chat design.
            </p>
          </section>

          <section className="guide-section" aria-labelledby="xbox">
            <h2 id="xbox">Is Big Walk on Xbox?</h2>
            <p>
              No. The current official status is that Big Walk is available on Windows, Mac, PS5, and Nintendo Switch 2,
              with no other platforms planned. No speculative Xbox release date is published here.
            </p>
          </section>

          <section className="guide-section" aria-labelledby="switch">
            <h2 id="switch">Switch vs Switch 2</h2>
            <p>
              Nintendo Switch 2 is listed as a supported platform. The original Nintendo Switch is not listed by House
              House, and current platform summaries treat it as unavailable.
            </p>
          </section>

          <section className="guide-section" aria-labelledby="players">
            <h2 id="players">Player Count & Matchmaking</h2>
            <p>
              Big Walk is for organized online groups, not public matchmaking. The official FAQ describes a 2-12 player
              range and says the game is meant to be played with a regular group across multiple sessions.
            </p>
            <p><Link href="/multiplayer/how-to-find-players">Use the source-checked LFG directory</Link> to compare active community spaces and post without exposing personal details or a public Join Code.</p>
          </section>

          <section className="guide-section" aria-labelledby="hosting">
            <h2 id="hosting">Hosting & Saves</h2>
            <p>
              The host keeps the save and progress. When the group continues, that same host should start the session
              again. Use the deeper research pages for unresolved save-transfer and host-change questions.
            </p>
            <ul className="check-list">
              <li><Link href="/multiplayer/hosting-and-saves">Hosting and saves</Link></li>
              <li><Link href="/multiplayer/transfer-save-to-new-host">Transfer save to a new host</Link></li>
            </ul>
          </section>

          <section className="guide-sources" aria-labelledby="multiplayer-sources">
            <h3 id="multiplayer-sources">Source links</h3>
            <p>The official FAQ is the primary source; third-party articles were used to cross-check platform and join-code wording.</p>
            <ul>
              {sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> <span>- {source.publisher}</span></li>)}
            </ul>
          </section>

          <section className="related-guides" aria-labelledby="multiplayer-related">
            <h2 id="multiplayer-related">Related guides</h2>
            <ul>
              <li><Link href="/multiplayer/best-group-size">Best group size</Link></li>
              <li><Link href="/multiplayer/hosting-and-saves">Hosting and saves</Link></li>
              <li><Link href="/multiplayer/transfer-save-to-new-host">Transfer save to new host</Link></li>
              <li><Link href="/multiplayer/how-to-find-players">How to find players</Link></li>
              <li><Link href="/troubleshooting">Troubleshooting</Link></li>
              <li><Link href="/achievements">Achievements</Link></li>
            </ul>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

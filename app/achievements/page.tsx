import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '../../components/json-ld';
import { SiteFooter, SiteHeader } from '../../components/site';
import { site } from '../../lib/content.mjs';

const lastChecked = '2026-08-11';

const title = 'Big Walk Trophy Guide - All 13 Achievements & Trophies';
const description =
  'Unlock every Big Walk trophy and achievement: 1 Platinum, 10 Gold, 2 Silver including 2 hidden trophies. Requirements, areas, and related walkthrough links.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/achievements' },
  robots: { index: true, follow: true },
  openGraph: { url: '/achievements', title, description },
  twitter: { card: 'summary', title, description },
};

const trophyRows = [
  { name: 'Big Walk', grade: 'Gold', requirement: 'Cross the drawbridge.', area: 'Opening drawbridge', difficulty: 'Easy', href: '/walkthrough/crosswalk' },
  { name: 'Big View', grade: 'Gold', requirement: 'Visit the map.', area: 'Red Tower map room', difficulty: 'Easy', href: '/walkthrough/red-tower-map-room' },
  { name: 'Big Sit', grade: 'Gold', requirement: 'Ride the chairlift.', area: 'Green Tower chairlift', difficulty: 'Easy', href: '/walkthrough/green-tower-chairlift' },
  { name: 'Big Ride', grade: 'Gold', requirement: 'Ride the train.', area: 'Blue Tower train', difficulty: 'Easy', href: '/walkthrough/blue-tower-train' },
  { name: 'Big Tunnel', grade: 'Gold', requirement: 'Enter a big tunnel.', area: 'Yellow Tower tunnels', difficulty: 'Easy', href: '/walkthrough/yellow-tower-tunnels' },
  { name: 'Big Wall', grade: 'Gold', requirement: 'Go beyond the wall.', area: 'Wall gate', difficulty: 'Medium', href: '/walkthrough/crosswalk' },
];

const trophies = [
  { name: 'Big Trophy', grade: 'Platinum', requirement: 'Unlock every other trophy.', area: 'Full trophy list', difficulty: 'Hard', spoiler: 'Full', related: 'Use the full route list below as the checklist.', guidance: 'Complete the other 12 PlayStation trophies. Steam has the same core objectives but no Platinum achievement.' },
  ...trophyRows.map((row) => ({ ...row, spoiler: 'Minor', related: row.href, guidance: `Complete the linked ${row.area.toLowerCase()} route.` })),
  { name: 'Big Pack', grade: 'Silver', requirement: 'Wear a backpack.', area: 'Wearable item structures', difficulty: 'Easy', spoiler: 'None', related: '/beginner-guide', guidance: 'Ask another player to place a backpack on your character at one of the blue wearable-item structures.' },
  { name: 'Big Help', grade: 'Silver', requirement: 'Wear something on your hip.', area: 'Wearable item structures', difficulty: 'Easy', spoiler: 'None', related: '/beginner-guide', guidance: 'Have another player equip a hip bag or belt on your character at a blue wearable-item structure.' },
  { name: 'Big Climb', grade: 'Gold', requirement: 'Reach the highest point.', area: 'Highest chairlift-side peak', difficulty: 'Medium', spoiler: 'Minor', related: '/walkthrough/green-tower-chairlift', guidance: 'Use the Green Tower chairlift route, then continue to the highest-point station and step onto its upper platform.' },
  { name: 'Big Makeover', grade: 'Gold', requirement: 'Get shiny.', area: 'Salon in the tunnel network', difficulty: 'Medium', spoiler: 'Minor', related: '/walkthrough/yellow-tower-tunnels', guidance: 'Reach the salon in the tunnel route and have another player use its makeover controls to paint your character a shiny color.' },
  { name: 'Big Goodbye', grade: 'Gold', requirement: 'Finish the game.', area: 'First ending beyond the wall', difficulty: 'Medium', spoiler: 'Full', related: '/walkthrough/true-ending', guidance: 'Complete the first ending by following the main route beyond the wall and finishing the giant-sphere sequence.' },
  { name: 'Big Game', grade: 'Gold', requirement: 'Completely finish the game.', area: 'Post-game completion route', difficulty: 'Hard', spoiler: 'Full', related: '/walkthrough/true-ending', guidance: 'Unlock the true ending after clearing every required puzzle, collecting the final completion items, and returning to the ending room.' },
];

const sources = [
  { title: 'Big Walk Trophy List', publisher: 'Gamer Social Club', url: 'https://gamersocialclub.ca/2026/06/17/big-walk-trophy-list/' },
  { title: 'Big Walk - Trophy List and Achievements Guide', publisher: 'KeenGamer', url: 'https://www.keengamer.com/articles/guides/big-walk-trophy-list-and-achievements-guide/' },
  { title: 'Complete Big Walk Trophy List', publisher: 'Insider Gaming', url: 'https://insider-gaming.com/big-walk-trophy-list/' },
  { title: 'Big Walk: How to Unlock Every Achievement', publisher: 'All Things How', url: 'https://allthings.how/big-walk-how-to-unlock-every-achievement-all-13-trophies/' },
];

function trophyId(name: string) {
  return `trophy-${name.toLowerCase().replaceAll(' ', '-')}`;
}

function RelatedLink({ value }: { value: string }) {
  if (!value.startsWith('/')) return <span>{value}</span>;
  return <Link href={value}>{value}</Link>;
}

export default function AchievementsPage() {
  const url = `${site.url}/achievements`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Big Walk Trophy & Achievement Guide',
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
      { '@type': 'ListItem', position: 2, name: 'Achievements', item: url },
    ],
  };

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <SiteHeader active="achievements" />
      <main className="guide-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol><li><Link href="/">Home</Link></li><li aria-current="page">Achievements</li></ol>
        </nav>
        <article className="guide-article">
          <section className="guide-hero">
            <p className="verification-status">Source-checked guide</p>
            <p className="guide-kicker">TROPHY & ACHIEVEMENT GUIDE</p>
            <h1>Big Walk Trophy & Achievement Guide</h1>
            <p className="guide-description">{description}</p>
            <p className="guide-meta">Trophy count / Platinum-Gold-Silver breakdown / Hidden trophies / Last checked: {lastChecked}</p>
            <ul className="compact-facts">
              <li>PS5: 13 trophies total: 1 Platinum, 10 Gold, 2 Silver, including 2 hidden trophies.</li>
              <li>Steam: 12 achievements for the same core objectives, without the PlayStation Platinum.</li>
            </ul>
          </section>

          <section className="route-overview" aria-labelledby="route-at-a-glance">
            <p className="hint-block__kicker">Quick answer</p>
            <h2 id="route-at-a-glance">Route at a glance</h2>
            <div className="table-wrap">
              <table className="guide-table">
                <thead><tr><th>Trophy</th><th>Requirement</th><th>Area</th><th>Difficulty</th></tr></thead>
                <tbody>
                  {trophyRows.map((row) => (
                    <tr key={row.name}>
                      <th scope="row"><Link href={`#${trophyId(row.name)}`}>{row.name}</Link></th>
                      <td>{row.requirement}</td>
                      <td>{row.area}</td>
                      <td>{row.difficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="hint-block" aria-labelledby="spoiler-free-hint">
            <p className="hint-block__kicker">SPOILER-FREE HINT</p>
            <h2 id="spoiler-free-hint">Most trophies follow progress</h2>
            <p>
              Most trophies unlock through normal progression: complete every tower route and you will earn the majority.
              The item trophies and post-game completion trophies are the ones to track deliberately.
            </p>
          </section>

          <section className="route-recovery" aria-labelledby="ending-trophy-split">
            <p className="hint-block__kicker">Ending trophies</p>
            <h2 id="ending-trophy-split">Normal ending vs true ending</h2>
            <p>
              <strong>Big Goodbye</strong> is the first ending and can unlock before the island is fully cleared.
              <strong> Big Game</strong> is the completion ending: clear the remaining puzzles and use the final
              post-game route. Follow the <Link href="/walkthrough/true-ending">true ending checklist</Link> if one
              of these two trophies is still missing.
            </p>
          </section>

          <section className="trophy-list" aria-labelledby="full-trophy-list">
            <h2 id="full-trophy-list">Full Trophy List</h2>
            {trophies.map((trophy) => (
              <section className="trophy-entry" id={trophyId(trophy.name)} key={trophy.name}>
                <h3>{trophy.name} <span>{trophy.grade}</span></h3>
                <dl className="guide-facts">
                  <div><dt>Requirement</dt><dd>{trophy.requirement}</dd></div>
                  <div><dt>How it unlocks</dt><dd>{trophy.guidance}</dd></div>
                  <div><dt>Area</dt><dd>{trophy.area}</dd></div>
                  <div><dt>Difficulty</dt><dd>{trophy.difficulty}</dd></div>
                  <div><dt>Related walkthrough</dt><dd><RelatedLink value={trophy.related} /></dd></div>
                  <div><dt>Spoiler level</dt><dd>{trophy.spoiler}</dd></div>
                </dl>
              </section>
            ))}
          </section>

          <section className="guide-sources" aria-labelledby="achievement-sources">
            <h3 id="achievement-sources">Source links</h3>
            <p>These sources were checked against one another for names, counts, grades, and high-level requirements.</p>
            <ul>
              {sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> <span>- {source.publisher}</span></li>)}
            </ul>
          </section>

          <section className="capture-list" aria-labelledby="achievement-captures">
            <h3 id="achievement-captures">Original screenshot capture list</h3>
            <ol>
              <li>Platinum trophy pop-up screen.</li>
              <li>Hidden trophy trigger scene.</li>
              <li>Full trophy or achievement list overview.</li>
            </ol>
          </section>

          <section className="related-guides" aria-labelledby="achievement-related">
            <h2 id="achievement-related">Related guides</h2>
            <ul>
              <li><Link href="/walkthrough">Big Walk walkthroughs</Link></li>
              <li><Link href="/multiplayer">Big Walk multiplayer and platforms</Link></li>
              <li><Link href="/puzzles">Big Walk puzzle directory</Link></li>
              <li><Link href="/walkthrough/true-ending">Big Walk true ending checklist</Link></li>
            </ul>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

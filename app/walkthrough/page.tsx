import Link from 'next/link';
import { evidenceMetadata } from '../../components/evidence-page';
import { JsonLd } from '../../components/json-ld';
import { SiteFooter, SiteHeader } from '../../components/site';
import { site, siteSectionBySlug, walkthroughHubGuides } from '../../lib/content.mjs';

const page = siteSectionBySlug('walkthrough')!;
const walkthroughGuides = walkthroughHubGuides();
const startPaths = page.startPaths ?? [];
const progression = page.progression ?? [];
const latestSourceCheck = walkthroughGuides
  .map((guide) => guide.updated)
  .slice()
  .sort()
  .at(-1);

function firstPrerequisite(guide: (typeof walkthroughGuides)[number]) {
  const prerequisite = guide.prerequisites[0];
  if (typeof prerequisite === 'string') return prerequisite;
  return prerequisite?.text ?? 'Open the route page for its checked starting state.';
}

export const metadata = evidenceMetadata(page);

export default function WalkthroughPage() {
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.h1,
    description: page.description,
    url: `${site.url}/walkthrough`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: walkthroughGuides.length,
      itemListElement: walkthroughGuides.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: guide.h1,
        item: `${site.url}/${guide.slug}`,
      })),
    },
  };

  const stuckEntries = walkthroughGuides.flatMap((guide) => (
    guide.commonFailures.slice(0, 2).map((failure) => ({ guide, failure }))
  ));

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <SiteHeader active="walkthrough" />
      <main className="walkthrough-hub">
        <div className="page-shell">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol><li><Link href="/">Home</Link></li><li aria-current="page">{page.h1}</li></ol>
          </nav>

          <header className="walkthrough-hub__hero">
            <p className="verification-status">ROUTE CENTER | SOURCE-CHECKED CHILD GUIDES</p>
            <h1>{page.h1}</h1>
            <p>{page.description}</p>
            <dl>
              <div><dt>Available walkthroughs</dt><dd>{walkthroughGuides.length}</dd></div>
              <div><dt>Latest source check</dt><dd>{latestSourceCheck}</dd></div>
            </dl>
          </header>

          <section className="walkthrough-start" aria-labelledby="walkthrough-start-heading">
            <p className="hint-block__kicker">START WITH YOUR CURRENT SITUATION</p>
            <h2 id="walkthrough-start-heading">Where should your group start?</h2>
            <div className="walkthrough-start__grid">
              {startPaths.map((path) => (
                <Link href={path.href} key={path.label}>
                  <span>{path.label}</span>
                  <strong>{path.title}</strong>
                  <p>{path.body}</p>
                  <small>Open the matching guide <span aria-hidden="true">-&gt;</span></small>
                </Link>
              ))}
            </div>
          </section>

          <section className="walkthrough-progression" aria-labelledby="walkthrough-progression-heading">
            <p className="hint-block__kicker">SPOILER-LIGHT PROGRESSION</p>
            <h2 id="walkthrough-progression-heading">A useful route through the full game</h2>
            <p>This is a navigation aid, not one mandatory universal order. After the fixed Crosswalk opening, choose routes and clean-up tasks that match your host world.</p>
            <ol>
              {progression.map((stage, index) => (
                <li key={stage.title}>
                  <Link href={stage.href}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><strong>{stage.title}</strong><p>{stage.body}</p></div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section className="route-map" aria-labelledby="route-map-heading">
            <p className="hint-block__kicker">ROUTE MAP</p>
            <h2 id="route-map-heading">Route map</h2>
            <p>This map shows the current source-checked guide paths. It is a navigation aid, not a claim that every tower must be completed in one universal order.</p>
            <div className="route-map__flow" aria-label="Current walkthrough route paths">
              <Link href="/walkthrough/crosswalk"><span>Start here</span><strong>Crosswalk opening route</strong></Link>
              <span className="route-map__connector" aria-hidden="true">-&gt;</span>
              <div className="route-map__branches">
                <Link href="/walkthrough/red-tower-map-room"><span>Tower path</span><strong>Red Tower Map Room</strong></Link>
                <Link href="/walkthrough/blue-tower-train"><span>Tower path</span><strong>Blue Tower Train</strong></Link>
                <Link href="/walkthrough/green-tower-chairlift"><span>Tower path</span><strong>Green Tower Chairlift</strong></Link>
                <Link href="/walkthrough/yellow-tower-tunnels"><span>Tower path</span><strong>Yellow Tower Tunnels</strong></Link>
              </div>
            </div>
            <div className="route-map__references" aria-label="Island reference routes">
              <Link href="/walkthrough/radio-channels"><span>Island reference</span><strong>All Radio Channels</strong></Link>
              <Link href="/walkthrough/green-room"><span>Evidence in progress</span><strong>Green Room research</strong></Link>
            </div>
          </section>

          <section className="route-center" aria-labelledby="route-center-heading">
            <p className="hint-block__kicker">COMPARE CURRENT ROUTES</p>
            <h2 id="route-center-heading">Choose the route that matches your session</h2>
            <div className="route-center__grid">
              {walkthroughGuides.map((guide) => (
                <article className="route-center-card" key={guide.slug}>
                  <p className="guide-card-category">{guide.category}</p>
                  <h3><Link href={`/${guide.slug}`}>{guide.h1}</Link></h3>
                  <dl>
                    <div>
                      <dt>Prerequisite</dt>
                      <dd>{firstPrerequisite(guide)}</dd>
                    </div>
                    <div><dt>Player count</dt><dd>{guide.playerCount}</dd></div>
                    <div><dt>Unlock result</dt><dd>{guide.goal}</dd></div>
                    <div><dt>Last verified</dt><dd>{guide.updated}</dd></div>
                  </dl>
                  <Link className="route-center-card__link" href={`/${guide.slug}`}>Open this route <span aria-hidden="true">-&gt;</span></Link>
                </article>
              ))}
            </div>
          </section>

          <section className="stuck-finder" aria-labelledby="stuck-finder-heading">
            <p className="hint-block__kicker">JUMP TO A RECOVERY STEP</p>
            <h2 id="stuck-finder-heading">Where are you stuck?</h2>
            <div className="stuck-finder__grid">
              {stuckEntries.map(({ guide, failure }) => (
                <Link href={`/${guide.slug}#recovery-${guide.slug.replaceAll('/', '-')}`} key={`${guide.slug}-${failure.problem}`}>
                  <span>{guide.area}</span>
                  <strong>{failure.problem}</strong>
                  <small>Open the checked recovery guidance <span aria-hidden="true">-&gt;</span></small>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

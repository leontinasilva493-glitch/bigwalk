import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryCard, EvidenceRouteCard, PuzzleCard } from '../components/guides';
import { JsonLd } from '../components/json-ld';
import { SectionHeading, SiteFooter, SiteHeader } from '../components/site';
import { guides, site, siteSections } from '../lib/content.mjs';
import { WalkerStack } from '../components/game-elements';

export const metadata: Metadata = {
  title: 'Big Walk Walkthrough — Hints & Puzzle Guides (2026)',
  description:
    'Stuck in Big Walk? Browse spoiler-free puzzle hints and source-checked solutions by tower, item, or location. Original marked screenshots are added after local capture.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Big Walk Walkthrough — Hints & Puzzle Guides (2026)',
    description:
      'Stuck in Big Walk? Browse spoiler-free puzzle hints and source-checked solutions by tower, item, or location. Original marked screenshots are added after local capture.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Big Walk Walkthrough — Hints & Puzzle Guides (2026)',
    description:
      'Stuck in Big Walk? Browse spoiler-free puzzle hints and source-checked solutions by tower, item, or location. Original marked screenshots are added after local capture.',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: site.url,
  description:
    'A spoiler-conscious directory of Big Walk puzzle hints, source-checked solutions, evidence status, and original-capture requirements.',
};

function GuideIcon({ type }: { type: 'tower' | 'area' | 'item' | 'achievement' }) {
  const paths = {
    tower: <><path d="M7 21h10M8.5 21 10 7h4l1.5 14M9.5 12h5M8 7h8l-4-4-4 4Z" /></>,
    area: <><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>,
    item: <><path d="M5 7.5 12 4l7 3.5v9L12 20l-7-3.5v-9Z" /><path d="m5 7.5 7 4 7-4M12 11.5V20" /></>,
    achievement: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H4c0 3 1.8 5 4.6 5M16 6h4c0 3-1.8 5-4.6 5M12 13v5M8 21h8M9 18h6" /></>,
  };

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

const puzzleGuides = guides.filter((guide) => guide.kind === 'puzzle');
const walkthroughGuides = guides.filter((guide) => guide.kind === 'walkthrough');

const categories = [
  { label: 'Tower', description: 'Browse available tower hints.', count: `${puzzleGuides.length} entries`, icon: <GuideIcon type="tower" />, href: '/puzzles#directory-by-tower' },
  { label: 'Area', description: 'Browse route walkthroughs by landmark.', count: `${walkthroughGuides.length} routes`, icon: <GuideIcon type="area" />, href: '/walkthrough' },
  { label: 'Item', description: 'Browse visible objects and clues.', count: `${puzzleGuides.length} entries`, icon: <GuideIcon type="item" />, href: '/puzzles#visual-finder' },
  { label: 'Achievement', description: 'Verification pending.', count: 'Coming soon', icon: <GuideIcon type="achievement" />, href: '/achievements' },
];

const featuredTopics = siteSections.filter((section) => [
  'puzzles/purple-challenges',
  'multiplayer',
  'troubleshooting',
].includes(section.slug));

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <SiteHeader />
      <main>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="page-shell home-hero__inner">
            <WalkerStack />
            <p className="eyebrow">A FIELD GUIDE FOR CURIOUS WALKERS</p>
            <h1 id="home-title">Big Walk Walkthrough: Hints &amp; Puzzle Guides</h1>
            <p className="home-hero__lede">
              Browse spoiler-free hints by tower, item, or location. Source-checked solutions come with their research
              trail; original marked screenshots are added after local capture.
            </p>
            <div className="home-path-actions" aria-label="Choose a guide path">
              <Link className="home-path-action" href="/puzzles">
                <span>Need a solution?</span>
                <strong>Find a puzzle <span aria-hidden="true">→</span></strong>
              </Link>
              <Link className="home-path-action" href="/walkthrough">
                <span>Need the next unlock?</span>
                <strong>Browse routes <span aria-hidden="true">→</span></strong>
              </Link>
            </div>
            <div className="popular-links" aria-label="Popular guide links">
              <span>Popular:</span>
              {[...puzzleGuides.slice(0, 2), ...walkthroughGuides].map((guide) => (
                <Link href={`/${guide.slug}`} key={guide.slug}>
                  {guide.area}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="discovery-section page-shell" aria-labelledby="browse-title">
          <SectionHeading kicker="FIND YOUR WAY" title="Browse the directory" />
          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard key={category.label} {...category} />
            ))}
          </div>
        </section>

        <section className="discovery-section page-shell" aria-labelledby="puzzles-title">
          <SectionHeading kicker="CURRENT ENTRIES" title="Browse available hints" />
          <div className="puzzle-list">
            {puzzleGuides.map((guide) => (
              <PuzzleCard guide={guide} key={guide.slug} />
            ))}
          </div>
          <Link className="text-link" href="/puzzles">
            Browse the full puzzle directory
            <span aria-hidden="true"> →</span>
          </Link>
        </section>

        <section className="discovery-section page-shell" aria-labelledby="routes-title">
          <SectionHeading kicker="UNLOCK ROUTES" title="Browse available walkthroughs" />
          <div className="puzzle-list">
            {walkthroughGuides.map((guide) => <PuzzleCard guide={guide} key={guide.slug} />)}
          </div>
          <Link className="text-link" href="/walkthrough">
            Browse walkthroughs
            <span aria-hidden="true"> →</span>
          </Link>
        </section>

        <section className="discovery-section discovery-section--tint" aria-labelledby="visual-finder-title">
          <div className="page-shell">
            <SectionHeading kicker="VISUAL FINDER" title="Start with what you can see" />
            <p className="section-intro">Visual words and alternate names are stored on the guide record, rather than being turned into duplicate URLs.</p>
            <div className="visual-cue-grid">
              {puzzleGuides.map((guide) => (
                <Link className="visual-cue-card" href={`/${guide.slug}`} key={guide.slug}>
                  <span>LOOK FOR</span>
                  <strong>{guide.visualCues.join(' + ')}</strong>
                  <small>Also called: {guide.aliases.join(', ')}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="discovery-section page-shell" aria-labelledby="topic-hubs-title">
          <SectionHeading kicker="NEXT QUESTIONS" title="Purple challenges, multiplayer, and troubleshooting" />
          <p className="section-intro">These topic hubs have permanent homes now. Their answers remain explicitly evidence-gated until they can be checked in the current game version.</p>
          <div className="evidence-route-grid">
            {featuredTopics.map((topic) => <EvidenceRouteCard key={topic.slug} route={topic} />)}
          </div>
        </section>

        <section className="home-reference" aria-labelledby="directory-guide-title">
          <div className="page-shell home-reference__inner">
            <SectionHeading kicker="PLAY WITH CONTEXT" title="How to use this Big Walk directory" />
            <div className="home-reference__intro">
              <p>
                Big Walk is built around the conversations a group has while exploring. A useful guide should help you
                get unstuck without turning the whole island into a checklist. Start with the visible clue you have — a
                colour, object, number, building, or landmark — and use the directory to find the closest matching
                entry. Each entry is filed under a practical path such as a tower, area, item, or achievement, so you
                can follow the vocabulary your group is already using rather than guess an in-game puzzle name.
              </p>
              <p>
                The first thing to read on a guide is its status. A spoiler-free hint is meant to restore momentum: it
                points your group back toward a clue or interaction without stating an answer. A source-checked
                walkthrough shows its current sources, player-count context, and limits. A first-hand walkthrough adds
                our own repeatable run and original annotated screenshots. Pages with unresolved reports stay visibly
                pending and out of search indexing.
              </p>
              <p>
                That distinction matters in an open-world co-op game. A good hint lets players keep communicating and
                experimenting together. A premature solution can be wrong for the session type, hide an important
                discovery, or send a group across the map for an object that is not available in their version of the
                world. Use the hint first, decide together how much help you want, then return for the detailed guide
                only when its evidence panel explains which level of checking it has completed.
              </p>
            </div>

            <div className="home-reference__grid" aria-label="Big Walk play context">
              <article>
                <h3>Choose the right world size</h3>
                <p>
                  Before starting a session, the host selects a 2-player, 3-player, or 4+ world. The official FAQ says
                  that parts of the world adapt to that choice, so a walkthrough must record the player-count variant
                  it was tested in.
                </p>
              </article>
              <article>
                <h3>Keep the same host in mind</h3>
                <p>
                  Big Walk saves progress automatically for the host. When a group resumes, the host needs to start the
                  session again; this is useful context when a player reports that an unlocked route or collected item
                  does not appear in a different session.
                </p>
              </article>
              <article>
                <h3>Communication is part of the puzzle</h3>
                <p>
                  The game is designed around its in-game voice and text chat. Distance, sound barriers, tools, and
                  player positions can all change how a group shares information, so guide steps should describe roles
                  rather than assume everyone sees the same thing.
                </p>
              </article>
              <article>
                <h3>Use a guide at the right depth</h3>
                <p>
                  Start from the page title and its small hint. Read the spoiler section only when your group agrees to
                  it. This keeps the directory useful for both players who want a nudge and players who actively want a
                  checked, step-by-step route.
                </p>
              </article>
            </div>

            <div className="home-reference__body">
              <h2>What makes a solution publishable?</h2>
              <p>
                A publishable source-checked solution on this site is not a paraphrase of a comment thread. It needs a
                clear starting state, a current source trail, a reproducible route, and an explicit player-count
                context. A first-hand upgrade adds an original run and confirms the result again in the current game
                version. Reports that cannot meet the source-checked bar remain noindex evidence pages.
              </p>
              <p>
                Original screenshots follow the same rule. They are captured for this guide, show the relevant landmark
                or interaction, and use descriptive alt text. They are not copied from a creator&apos;s video or another
                guide. A public video can be cited or embedded as a reference where its creator permits embedding, but
                its frames are never presented as this site&apos;s original capture.
              </p>
              <p>
                This process is intentionally slower than publishing a quick answer. Big Walk supports two to twelve
                players, has player-count-sensitive worlds, and asks groups to solve problems through communication.
                Evidence labels keep useful discovery pages online without confusing a source-checked route, a theory,
                an older recording, and a finished first-hand capture. They also make it clear what must be rechecked
                when the game is updated.
              </p>
              <p>
                For general setup, saving, accessibility, joining a host, cross-play, and the game&apos;s communication
                model, read the <a href="https://bigwalk.game/faq/">official Big Walk FAQ</a>. This directory links to
                the same practical questions in its beginner, multiplayer, and troubleshooting hubs, while reserving
                puzzle-answer claims for pages that have completed the evidence gate.
              </p>
            </div>
          </div>
        </section>

        <section className="how-it-works" aria-labelledby="how-it-works-title">
          <div className="page-shell">
            <SectionHeading kicker="A SPOILER-CONSCIOUS PATH" title="How It Works" />
            <ol className="how-it-works__steps">
              <li>
                <span>01</span>
                <div>
                  <h3>Find the moment</h3>
                  <p>Use the directory to find the listed object, place, tower, or number.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Read a small hint</h3>
                  <p>Use the available hint as orientation; unverified solutions are not presented as fact.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Return when verified</h3>
                  <p>Verified solutions and original marked screenshots are being added only after first-hand verification.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

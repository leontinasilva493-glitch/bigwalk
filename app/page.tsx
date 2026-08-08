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
    'Stuck in Big Walk? Browse spoiler-free puzzle hints by tower, item, or location. Verified solutions and marked screenshots are added only after first-hand checks.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Big Walk Walkthrough — Hints & Puzzle Guides (2026)',
    description:
      'Stuck in Big Walk? Browse spoiler-free puzzle hints by tower, item, or location. Verified solutions and marked screenshots are added only after first-hand checks.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Big Walk Walkthrough — Hints & Puzzle Guides (2026)',
    description:
      'Stuck in Big Walk? Browse spoiler-free puzzle hints by tower, item, or location. Verified solutions and marked screenshots are added only after first-hand checks.',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: site.url,
  description:
    'A spoiler-conscious directory of Big Walk puzzle hints, evidence status, and verified guides.',
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

const categories = [
  { label: 'Tower', description: 'Browse available tower hints.', count: '1 entry', icon: <GuideIcon type="tower" /> },
  { label: 'Area', description: 'Browse available area hints.', count: '1 entry', icon: <GuideIcon type="area" /> },
  { label: 'Item', description: 'Browse available item hints.', count: '2 entries', icon: <GuideIcon type="item" /> },
  { label: 'Achievement', description: 'Verification pending.', count: 'Coming soon', icon: <GuideIcon type="achievement" /> },
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
              Browse spoiler-free hints by tower, item, or location. Verified solutions and marked screenshots are
              added only after first-hand checks.
            </p>
            <div className="guide-search" role="search" aria-label="Guide search preview">
              <label className="sr-only" htmlFor="guide-search-input">
                Search Big Walk guides
              </label>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="guide-search__icon">
                <circle cx="10.8" cy="10.8" r="6.4" />
                <path d="m16 16 4.2 4.2" />
              </svg>
              <input
                id="guide-search-input"
                type="search"
                placeholder={'Search puzzles... try "purple things"'}
                readOnly
                aria-describedby="search-note"
              />
              <span className="guide-search__button" aria-hidden="true">
                Browse guides
              </span>
            </div>
            <p className="sr-only" id="search-note">
              Search is a visual directory prompt; use the popular guide links below.
            </p>
            <div className="popular-links" aria-label="Popular guide links">
              <span>Popular:</span>
              {guides.slice(0, 3).map((guide) => (
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
            {guides.map((guide) => (
              <PuzzleCard guide={guide} key={guide.slug} />
            ))}
          </div>
          <Link className="text-link" href="/puzzles">
            Browse the full puzzle directory
            <span aria-hidden="true"> →</span>
          </Link>
        </section>

        <section className="discovery-section discovery-section--tint" aria-labelledby="visual-finder-title">
          <div className="page-shell">
            <SectionHeading kicker="VISUAL FINDER" title="Start with what you can see" />
            <p className="section-intro">Visual words and alternate names are stored on the guide record, rather than being turned into duplicate URLs.</p>
            <div className="visual-cue-grid">
              {guides.map((guide) => (
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
                points your group back toward a clue or interaction without stating an answer. A full walkthrough is a
                different promise. It needs a repeatable sequence, a current-version check, and original annotated
                screenshots before this site treats it as a fact. Until then, the page stays visibly pending and out of
                search indexing.
              </p>
              <p>
                That distinction matters in an open-world co-op game. A good hint lets players keep communicating and
                experimenting together. A premature solution can be wrong for the session type, hide an important
                discovery, or send a group across the map for an object that is not available in their version of the
                world. Use the hint first, decide together how much help you want, then return for the detailed guide
                only when its verification panel says the evidence is complete.
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
                A publishable solution on this site is not a paraphrase of a comment thread. First, the puzzle needs a
                clear starting state: the visible object or place, any prerequisite access, and the world-size variant.
                Next comes a reproducible route that says what each player does and what changes after each step. The
                final result must be checked again in the current game version. Only then can the guide move from a
                pending hint page to an indexable walkthrough.
              </p>
              <p>
                Screenshots follow the same rule. They are captured for this guide, show the relevant landmark or
                interaction, and use descriptive alt text. They are not copied from a creator&apos;s video or another guide.
                If a public video helps locate a puzzle, it can be cited or embedded as a reference where the creator
                permits embedding, but the written steps and explanatory screenshots still need their own verification.
              </p>
              <p>
                This process is intentionally slower than publishing a quick answer. Big Walk supports two to twelve
                players, has player-count-sensitive worlds, and asks groups to solve problems through communication.
                Evidence labels let the site keep useful discovery pages online now without confusing a lead, a theory,
                or an older recording with a finished solution. They also make it clear what must be rechecked when the
                game is updated.
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

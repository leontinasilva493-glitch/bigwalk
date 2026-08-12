import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryCard, PuzzleCard } from '../components/guides';
import { JsonLd } from '../components/json-ld';
import { SectionHeading, SiteFooter, SiteHeader } from '../components/site';
import {
  guides,
  homepageDemandGuideSlugs,
  homepageDirectoryStats,
  homepageFeaturedGuideSlugs,
  site,
} from '../lib/content.mjs';
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
const directoryStats = homepageDirectoryStats();
const featuredGuides = homepageFeaturedGuideSlugs
  .map((slug) => guides.find((guide) => guide.slug === slug))
  .filter((guide): guide is (typeof guides)[number] => Boolean(guide));
const demandGuides = homepageDemandGuideSlugs
  .map((slug) => guides.find((guide) => guide.slug === slug))
  .filter((guide): guide is (typeof guides)[number] => Boolean(guide));

const categories = [
  { label: 'Tower', description: 'Browse available tower hints.', count: `${directoryStats.puzzleEntries} puzzle entries`, icon: <GuideIcon type="tower" />, href: '/puzzles#directory-by-tower' },
  { label: 'Area', description: 'Browse route walkthroughs by landmark.', count: `${directoryStats.walkthroughEntries} routes`, icon: <GuideIcon type="area" />, href: '/walkthrough' },
  { label: 'Item', description: 'Browse visible objects and clues.', count: `${directoryStats.visualEntries} visual entries`, icon: <GuideIcon type="item" />, href: '/puzzles#visual-finder' },
  { label: 'Achievement', description: 'Browse the source-checked trophy list.', count: `${directoryStats.achievements} trophies`, icon: <GuideIcon type="achievement" />, href: '/achievements' },
];

const quickAnswers = [
  {
    label: 'Crossplay',
    question: 'Can I play with friends on other platforms?',
    answer: 'Yes. PS5, PC/Mac, and Switch 2 can play together with a Join Code.',
    href: '/multiplayer',
  },
  {
    label: 'Trophies',
    question: 'How many trophies are in Big Walk?',
    answer: '13 total on PS5: 1 Platinum, 10 Gold, and 2 Silver. Steam tracks the 12 non-Platinum objectives.',
    href: '/achievements',
  },
  {
    label: 'Platforms',
    question: 'Is Big Walk on Xbox or Switch?',
    answer: 'It is on PS5, PC, Mac, and Switch 2. It is not listed for Xbox or the original Switch.',
    href: '/multiplayer',
  },
];
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
            <div className="popular-links" aria-label="Featured guide links">
              <span>Featured:</span>
              {featuredGuides.map((guide) => (
                <Link href={`/${guide.slug}`} key={guide.slug}>
                  {guide.area}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="quick-answers page-shell" aria-labelledby="quick-answers-title">
          <SectionHeading kicker="QUICK ANSWERS" title="Current high-intent questions" />
          <div className="quick-answer-grid">
            {quickAnswers.map((item) => (
              <Link className="quick-answer-card" href={item.href} key={item.label}>
                <span>{item.label}</span>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </Link>
            ))}
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

        <section className="discovery-section page-shell" aria-labelledby="demand-guides-title">
          <SectionHeading kicker="NEW DEMAND PAGES" title="True ending and peg puzzle" />
          <p className="section-intro">
            These two focused pages answer distinct search intents without creating duplicate item or ending hubs.
            They are source-labelled and available for review, but remain outside search indexing until first-hand
            captures confirm the current-version route.
          </p>
          <div className="puzzle-list">
            {demandGuides.map((guide) => <PuzzleCard guide={guide} key={guide.slug} />)}
          </div>
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

        <section className="home-reference" aria-labelledby="directory-guide-title">
          <div className="page-shell home-reference__inner">
            <SectionHeading kicker="PLAY WITH CONTEXT" title="How to use this Big Walk directory" />
            <div className="home-reference__intro">
              <p>
                Big Walk is built around the conversations a group has while exploring. A useful guide should help you
                get unstuck without turning the whole island into a checklist. Start with the visible clue your group
                has, use the closest tower, area, item, or achievement entry, and check the evidence status before
                opening spoilers so source-checked routes, first-hand captures, and unresolved reports stay clearly
                separated in a player-count-sensitive co-op game.
              </p>
            </div>
            <Link className="text-link" href="/methodology">
              Read the full methodology
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

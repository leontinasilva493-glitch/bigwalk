import type { Metadata } from 'next';
import { CategoryCard, EvidenceRouteCard, PuzzleCard } from '../../components/guides';
import { JsonLd } from '../../components/json-ld';
import { SectionHeading, SiteFooter, SiteHeader } from '../../components/site';
import { buildPuzzleDirectoryJsonLd, guides, site, siteSections } from '../../lib/content.mjs';

const puzzleDirectorySeo = site.puzzleDirectory;

export const metadata: Metadata = {
  title: { absolute: puzzleDirectorySeo.title },
  description: puzzleDirectorySeo.description,
  alternates: { canonical: '/puzzles' },
  openGraph: {
    url: '/puzzles',
    title: puzzleDirectorySeo.title,
    description: puzzleDirectorySeo.description,
  },
  twitter: {
    card: 'summary',
    title: puzzleDirectorySeo.title,
    description: puzzleDirectorySeo.description,
  },
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
  { label: 'Tower', description: 'Browse available tower hints.', count: `${puzzleGuides.length} entries`, icon: <GuideIcon type="tower" />, href: '#directory-by-tower' },
  { label: 'Area', description: 'Browse route walkthroughs by landmark.', count: `${walkthroughGuides.length} routes`, icon: <GuideIcon type="area" />, href: '/walkthrough' },
  { label: 'Item', description: 'Browse visible objects and clues.', count: `${puzzleGuides.length} entries`, icon: <GuideIcon type="item" />, href: '#visual-finder' },
  { label: 'Achievement', description: 'Verification pending.', count: 'Coming soon', icon: <GuideIcon type="achievement" />, href: '/achievements' },
];

export default function PuzzlesPage() {
  const puzzleDirectoryJsonLd = buildPuzzleDirectoryJsonLd(puzzleGuides);
  const guidesByTower = puzzleGuides.reduce<Record<string, typeof guides[number][]>>((groups, guide) => {
    (groups[guide.tower] ??= []).push(guide);
    return groups;
  }, {});
  const topicHubs = siteSections.filter((section) => [
    'puzzles/purple-challenges',
    'walkthrough',
    'troubleshooting',
  ].includes(section.slug));

  return (
    <>
      <JsonLd data={puzzleDirectoryJsonLd} />
      <SiteHeader active="puzzles" />
      <main className="directory-page">
        <section className="directory-hero">
          <div className="page-shell">
            <p className="eyebrow">THE BIG WALK FIELD DIRECTORY</p>
            <h1>{puzzleDirectorySeo.h1}</h1>
            <p>
              Browse hints and source-checked solutions by tower, item, or location, with clear route context and
              source links; unresolved reports stay out of search indexing.
            </p>
          </div>
        </section>

        <section className="discovery-section page-shell" aria-labelledby="browse-guide-categories">
          <h2 className="sr-only" id="browse-guide-categories">Browse guide categories</h2>
          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard key={category.label} {...category} />
            ))}
          </div>
        </section>

        <section id="visual-finder" className="visual-finder-section page-shell" aria-labelledby="visual-finder-heading">
          <SectionHeading kicker="VISUAL FINDER" title="Browse by what you saw" />
          <p className="section-intro">Each clue is filed under its visible words and aliases. Aliases improve discovery without creating thin duplicate pages.</p>
          <div className="visual-cue-grid">
            {puzzleGuides.map((guide) => (
              <a className="visual-cue-card" href={`/${guide.slug}`} key={guide.slug}>
                <span>VISUAL CUE</span>
                <strong>{guide.visualCues.join(' + ')}</strong>
                <small>{guide.aliases.join(' / ')}</small>
              </a>
            ))}
          </div>
        </section>

        <section id="directory-by-tower" className="directory-groups page-shell">
          <SectionHeading kicker="DIRECTORY BY TOWER" title="Browse by landmark" />
          {Object.entries(guidesByTower).map(([tower, towerGuides]) => (
            <div className="directory-group" key={tower}>
              <h2>{tower}</h2>
              <div className="puzzle-list">
                {towerGuides.map((guide) => (
                  <PuzzleCard guide={guide} key={guide.slug} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="discovery-section discovery-section--tint" aria-labelledby="puzzle-topic-hubs">
          <div className="page-shell">
            <SectionHeading kicker="TOPIC HUBS" title="Keep similar questions together" />
            <div className="evidence-route-grid">
              {topicHubs.map((topic) => <EvidenceRouteCard key={topic.slug} route={topic} />)}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

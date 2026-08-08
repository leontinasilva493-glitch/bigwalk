import type { Metadata } from 'next';
import { CategoryCard, PuzzleCard } from '../../components/guides';
import { SectionHeading, SiteFooter, SiteHeader } from '../../components/site';
import { guides } from '../../lib/content.mjs';

export const metadata: Metadata = {
  title: 'Big Walk Hints & Puzzle Directory',
  description:
    'Browse available Big Walk hints by tower, item, or location. Verified solutions and original marked screenshots are being added only after first-hand verification.',
  alternates: { canonical: '/puzzles' },
  openGraph: {
    url: '/puzzles',
    title: 'Big Walk Hints & Puzzle Directory',
    description:
      'Browse available Big Walk hints by tower, item, or location. Verified solutions and original marked screenshots are being added only after first-hand verification.',
  },
  twitter: {
    card: 'summary',
    title: 'Big Walk Hints & Puzzle Directory',
    description:
      'Browse available Big Walk hints by tower, item, or location. Verified solutions and original marked screenshots are being added only after first-hand verification.',
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

const categories = [
  { label: 'Tower', description: 'Browse available tower hints.', count: '1 entry', icon: <GuideIcon type="tower" /> },
  { label: 'Area', description: 'Browse available area hints.', count: '1 entry', icon: <GuideIcon type="area" /> },
  { label: 'Item', description: 'Browse available item hints.', count: '2 entries', icon: <GuideIcon type="item" /> },
  { label: 'Achievement', description: 'Verification pending.', count: 'Coming soon', icon: <GuideIcon type="achievement" /> },
];

export default function PuzzlesPage() {
  const guidesByTower = guides.reduce<Record<string, typeof guides[number][]>>((groups, guide) => {
    (groups[guide.tower] ??= []).push(guide);
    return groups;
  }, {});

  return (
    <>
      <SiteHeader active="puzzles" />
      <main className="directory-page">
        <section className="directory-hero">
          <div className="page-shell">
            <p className="eyebrow">THE BIG WALK FIELD DIRECTORY</p>
            <h1>Big Walk Puzzle Hints &amp; Directory</h1>
            <p>
              Browse the available hints by tower, item, or location. Verified solutions and original
              marked screenshots are being added only after first-hand verification.
            </p>
          </div>
        </section>

        <section className="discovery-section page-shell" aria-label="Browse guide categories">
          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard key={category.label} {...category} />
            ))}
          </div>
        </section>

        <section className="directory-groups page-shell">
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
      </main>
      <SiteFooter />
    </>
  );
}

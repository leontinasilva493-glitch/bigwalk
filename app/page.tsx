import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryCard, PuzzleCard } from '../components/guides';
import { SectionHeading, SiteFooter, SiteHeader } from '../components/site';
import { guides } from '../lib/content.mjs';
import { WalkerStack } from '../components/game-elements';

export const metadata: Metadata = {
  description:
    'Browse available Big Walk hints by tower, item, or location. Verified solutions and original marked screenshots are being added only after first-hand verification.',
  alternates: { canonical: '/' },
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

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="page-shell home-hero__inner">
            <WalkerStack />
            <p className="eyebrow">A FIELD GUIDE FOR CURIOUS WALKERS</p>
            <h1 id="home-title">Big Walk Hints &amp; Puzzle Directory</h1>
            <p className="home-hero__lede">
              Browse the available hints by tower, item, or location. Verified solutions and original
              marked screenshots are being added only after first-hand verification.
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

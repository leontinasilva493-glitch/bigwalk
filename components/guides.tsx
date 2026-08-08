import Link from 'next/link';
import type { ReactNode } from 'react';
import { guides } from '../lib/content.mjs';
import { SignalFlareIcon } from './game-elements';

type Guide = (typeof guides)[number];

export function PuzzleCard({ guide }: { guide: Guide }) {
  return (
    <article className="guide-card">
      <p className="guide-card-category">{guide.category}</p>
      <h3><Link href={`/${guide.slug}`}>{guide.h1}</Link></h3>
      <p>{guide.description}</p>
      <p className="guide-card-meta">{guide.area} · {guide.readTime}</p>
    </article>
  );
}

export function CategoryCard({ label, description, count, icon }: {
  label: string;
  description: string;
  count: string | number;
  icon: ReactNode;
}) {
  return (
    <article className="category-card">
      <div className="category-card-icon" aria-hidden="true">{icon}</div>
      <h3>{label}</h3>
      <p>{description}</p>
      <p className="category-card-count">{count}</p>
    </article>
  );
}

export function HintBlock({ guide }: { guide: Guide }) {
  return (
    <section className="hint-block" aria-labelledby="hint-heading">
      <p className="hint-block__kicker">STUCK? HERE&apos;S A HINT FIRST</p>
      <h2 id="hint-heading">Spoiler-free hint</h2>
      <p>{guide.hint}</p>
    </section>
  );
}

export function VerificationPanel({ guide }: { guide: Guide }) {
  return (
    <section className="verification-panel" aria-labelledby="verification-heading">
      <div className="spoiler-gate__title"><SignalFlareIcon className="spoiler-gate__icon" /><div><p className="hint-block__kicker">SPOILER WARNING</p><h2 id="verification-heading">Solution and screenshot status</h2></div></div>
      <p>Verified solution and annotated screenshot are pending first-hand verification.</p>
      <p>
        Required WebP hand-off: <code>{guide.assetRequirement}</code> — natural alt text: {guide.imageAlt}.
      </p>
      <details className="spoiler-gate">
        <summary>Reveal Full Solution Status</summary>
        <p>No solution is shown here yet. This spoiler gate will only contain the verified answer after first-hand verification.</p>
      </details>
    </section>
  );
}

export function Breadcrumbs({ guide }: { guide: Guide }) {
  const isPuzzle = guide.kind === 'puzzle';

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link href="/">Home</Link></li>
        {isPuzzle ? <li><Link href="/puzzles">Puzzles</Link></li> : null}
        <li aria-current="page">{guide.h1}</li>
      </ol>
    </nav>
  );
}

export function RelatedGuides({ relatedSlugs }: { relatedSlugs: string[] }) {
  const related = relatedSlugs
    .map((slug) => slug === 'home' ? undefined : guides.find((guide) => guide.slug === slug))
    .filter((guide): guide is Guide => Boolean(guide));

  return (
    <section className="related-guides" aria-labelledby="related-guides-heading">
      <h2 id="related-guides-heading">Related guides</h2>
      <ul>
        {related.map((guide) => (
          <li key={guide.slug}><Link href={`/${guide.slug}`}>{guide.h1}</Link></li>
        ))}
        {relatedSlugs.includes('home') ? <li><Link href="/">Big Walk Walkthrough home</Link></li> : null}
      </ul>
    </section>
  );
}

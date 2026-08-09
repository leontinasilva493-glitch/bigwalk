import Link from 'next/link';
import type { ReactNode } from 'react';
import { guides } from '../lib/content.mjs';
import { SignalFlareIcon } from './game-elements';

type Guide = (typeof guides)[number];

type EvidenceRoute = {
  slug: string;
  h1: string;
  description: string;
};

export function PuzzleCard({ guide }: { guide: Guide }) {
  return (
    <article className="guide-card">
      <p className="guide-card-category">{guide.category}</p>
      <h3><Link href={`/${guide.slug}`}>{guide.h1}</Link></h3>
      <p>{guide.description}</p>
      <p className="guide-card-meta">{guide.area} · {guide.readTime} · {guide.indexable ? 'Source-checked' : 'Evidence in progress'}</p>
    </article>
  );
}

export function CategoryCard({ label, description, count, icon, href }: {
  label: string;
  description: string;
  count: string | number;
  icon: ReactNode;
  href: string;
}) {
  return (
    <Link className="category-card" href={href}>
      <div className="category-card-icon" aria-hidden="true">{icon}</div>
      <h3>{label}</h3>
      <p>{description}</p>
      <p className="category-card-count">{count}</p>
    </Link>
  );
}

export function EvidenceRouteCard({ route }: { route: EvidenceRoute }) {
  return (
    <article className="evidence-route-card">
      <p className="guide-card-category">EVIDENCE-GATED TOPIC</p>
      <h3><Link href={`/${route.slug}`}>{route.h1}</Link></h3>
      <p>{route.description}</p>
      <p className="guide-card-meta">Verification in progress - not indexed</p>
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

export function RouteOverview({ guide }: { guide: Guide }) {
  const routeSummary = 'routeSummary' in guide ? guide.routeSummary : undefined;
  if (!routeSummary?.length) return null;

  return (
    <section className="route-overview" aria-labelledby="route-overview-heading">
      <p className="hint-block__kicker">Quick answer</p>
      <h2 id="route-overview-heading">Route at a glance</h2>
      <p>{guide.goal}</p>
      <ol className="route-summary">
        {routeSummary.map((stage) => <li key={stage}>{stage}</li>)}
      </ol>
    </section>
  );
}

export function VerificationPanel({ guide }: { guide: Guide }) {
  const isPublished = guide.indexable;

  return (
    <section className="verification-panel" aria-labelledby="verification-heading">
      <div className="spoiler-gate__title"><SignalFlareIcon className="spoiler-gate__icon" /><div><p className="hint-block__kicker">{isPublished ? 'SPOILER WARNING' : 'EVIDENCE STATUS'}</p><h2 id="verification-heading">{isPublished ? 'Source-checked solution' : 'What the available evidence does and does not prove'}</h2></div></div>
      <dl className="guide-facts">
        <div><dt>Source check</dt><dd>{guide.sourceCheckedAt}</dd></div>
        <div><dt>Platforms</dt><dd>{guide.platforms.join('; ')}</dd></div>
        <div><dt>Player count</dt><dd>{guide.playerCount}</dd></div>
      </dl>
      <p>{guide.evidenceNote}</p>
      <details className="spoiler-gate">
        <summary>{isPublished ? 'Reveal the full solution' : 'Read the current evidence trail'}</summary>
        <ol className="solution-steps">
          {guide.solutionSteps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{step.title}</h3><p>{step.body}</p></div>
            </li>
          ))}
        </ol>
      </details>
      {guide.commonFailures.length ? (
        <section className="route-recovery" aria-labelledby={`recovery-${guide.slug.replaceAll('/', '-')}`}>
          <h3 id={`recovery-${guide.slug.replaceAll('/', '-')}`}>If the route stalls</h3>
          <div className="route-recovery__table-wrap">
            <table>
              <thead><tr><th>Problem</th><th>What to do</th></tr></thead>
              <tbody>
                {guide.commonFailures.map((failure) => (
                  <tr key={failure.problem}>
                    <th scope="row">{failure.problem}</th>
                    <td>{failure.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
      <section className="guide-sources" aria-labelledby={`sources-${guide.slug.replaceAll('/', '-')}`}>
        <h3 id={`sources-${guide.slug.replaceAll('/', '-')}`}>Source links</h3>
        <p>These links support the research trail. Their video frames and screenshots are not republished here.</p>
        <ul>
          {guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> <span>— {source.publisher}</span></li>)}
        </ul>
      </section>
      {'video' in guide && guide.video ? (
        <section className="guide-video" aria-labelledby={`video-${guide.slug.replaceAll('/', '-')}`}>
          <h3 id={`video-${guide.slug.replaceAll('/', '-')}`}>{guide.video.title}</h3>
          <p>{guide.video.note}</p>
          <div className="video-frame"><iframe title={guide.video.title} src={`https://www.youtube-nocookie.com/embed/${guide.video.id}`} loading="lazy" allowFullScreen /></div>
        </section>
      ) : null}
      <section className="capture-list" aria-labelledby={`captures-${guide.slug.replaceAll('/', '-')}`}>
        <h3 id={`captures-${guide.slug.replaceAll('/', '-')}`}>Original screenshot capture list</h3>
        <p>Original local gameplay screenshots are still required for this guide. This checklist prevents a third-party frame from being substituted for an original capture.</p>
        <ol>
          {guide.screenshotRequests.map((request) => <li key={request.label}><strong>{request.label}:</strong> {request.description}</li>)}
        </ol>
      </section>
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
        {relatedSlugs.includes('puzzles') ? <li><Link href="/puzzles">Big Walk Puzzle Directory</Link></li> : null}
        {relatedSlugs.includes('home') ? <li><Link href="/">Big Walk Walkthrough home</Link></li> : null}
      </ul>
    </section>
  );
}

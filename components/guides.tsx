import Link from 'next/link';
import type { ReactNode } from 'react';
import { guides } from '../lib/content.mjs';
import { SignalFlareIcon } from './game-elements';
import { YouTubeEmbed } from './youtube-embed';

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

export function PuzzleMvpOverview({ guide }: { guide: Guide }) {
  const directAnswer = 'directAnswer' in guide ? guide.directAnswer : undefined;
  const progressiveHints = 'progressiveHints' in guide ? guide.progressiveHints : undefined;
  const navigationMethods = 'navigationMethods' in guide ? guide.navigationMethods : undefined;

  if (!directAnswer || !progressiveHints?.length || !navigationMethods?.length) return null;

  return (
    <div className="puzzle-mvp-overview">
      <section className="progressive-hints" aria-labelledby="progressive-hints-heading">
        <p className="hint-block__kicker">MORE HELP, ONE STEP AT A TIME</p>
        <h2 id="progressive-hints-heading">Progressive hints</h2>
        <div className="progressive-hints__list">
          {progressiveHints.map((hint) => (
            <details key={hint.title}>
              <summary>{hint.title}</summary>
              <p>{hint.body}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="quick-answer" className="quick-answer" aria-labelledby="quick-answer-heading">
        <p className="hint-block__kicker">DIRECT ANSWER</p>
        <h2 id="quick-answer-heading">What 4166, 1899 means</h2>
        <details>
          <summary>Reveal the short solution</summary>
          <p>{guide.directAnswer}</p>
        </details>
      </section>

      <section id="navigation-methods" className="navigation-methods" aria-labelledby="navigation-methods-heading">
        <p className="hint-block__kicker">CHOOSE YOUR TOOL</p>
        <h2 id="navigation-methods-heading">Two ways to reach the coordinates</h2>
        <div className="navigation-method-grid">
          {navigationMethods.map((method) => (
            <article key={method.title}>
              <h3>{method.title}</h3>
              <p>{method.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function CoordinatesFirstScreen({ guide }: { guide: Guide }) {
  if (!('numberConfirmation' in guide) || !guide.numberConfirmation) return null;

  return (
    <div className="coordinates-first-screen">
      <section className="number-confirmation" aria-labelledby="number-confirmation-heading">
        <p className="hint-block__kicker">CHECK THE CLUE</p>
        <h2 id="number-confirmation-heading">{guide.numberConfirmation.heading}</h2>
        <p>{guide.numberConfirmation.body}</p>
        <p className="number-confirmation__disambiguation">{guide.numberConfirmation.disambiguation}</p>
      </section>

      <section id="before-you-start" className="guide-checklist" aria-labelledby="before-you-start-heading">
        <p className="hint-block__kicker">BEFORE YOU START</p>
        <h2 id="before-you-start-heading">Unlock the map and compass first</h2>
        <ul>
          {guide.prerequisites.map((item) => {
            const text = typeof item === 'string' ? item : item.text;
            return <li key={text}>{text}{typeof item !== 'string' && item.href ? <> <Link href={item.href}>{item.linkLabel}</Link>.</> : null}</li>;
          })}
        </ul>
      </section>

      <section className="player-roles" aria-labelledby="player-roles-heading">
        <p className="hint-block__kicker">SPLIT THE FINAL JOB</p>
        <h2 id="player-roles-heading">Player A / Player B</h2>
        <div className="player-role-grid">
          {guide.roleAssignments.map((role) => <article key={role.title}><h3>{role.title}</h3><p>{role.body}</p></article>)}
        </div>
      </section>

      <section className="lost-reward" aria-labelledby="lost-reward-heading">
        <p className="hint-block__kicker">{guide.lostReward.status}</p>
        <h2 id="lost-reward-heading">Lost the reward?</h2>
        <p>{guide.lostReward.body}</p>
      </section>
    </div>
  );
}

export function GreenRoomResearch({ guide }: { guide: Guide }) {
  if (!('greenRoomSections' in guide) || !guide.greenRoomSections) return null;

  const sections = guide.greenRoomSections;
  const plannedLinkLabels: Record<string, string> = {
    'puzzles/purple-things-where-to-use': 'Where Do Purple Things Go?',
    'puzzles/purple-challenges': 'Purple Challenges directory',
    'walkthrough/true-ending': 'True Ending research page (planned)',
  };

  return (
    <section className="green-room-research" aria-labelledby="green-room-research-heading">
      <p className="hint-block__kicker">NOINDEX RESEARCH ROUTE</p>
      <h2 id="green-room-research-heading">Routes, entrance evidence, and reported room use</h2>

      <section aria-labelledby="green-room-routes-heading">
        <h3 id="green-room-routes-heading">Two routes from spawn</h3>
        <div className="research-card-grid">
          {sections.routes.map((route) => <article key={route.title}><h4>{route.title}</h4><p>{route.body}</p></article>)}
        </div>
      </section>

      <section aria-labelledby="green-room-entrance-heading">
        <p className="evidence-label">{sections.entrance.status}</p>
        <h3 id="green-room-entrance-heading">{sections.entrance.title}</h3>
        <p>{sections.entrance.body}</p>
      </section>

      <section aria-labelledby="green-room-slots-heading">
        <p className="evidence-label">{sections.slots.status}</p>
        <h3 id="green-room-slots-heading">{sections.slots.title}</h3>
        <p>{sections.slots.body}</p>
      </section>

      <section className="evidence-conflict" aria-labelledby="green-room-conflict-heading">
        <p className="evidence-label">{sections.itemConflict.status}</p>
        <h3 id="green-room-conflict-heading">{sections.itemConflict.title}</h3>
        <p>{sections.itemConflict.body}</p>
        <ul>{sections.itemConflict.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul>
      </section>

      <section aria-labelledby="green-room-map-heading">
        <p className="evidence-label">{sections.mapTracking.status}</p>
        <h3 id="green-room-map-heading">{sections.mapTracking.title}</h3>
        <p>{sections.mapTracking.body}</p>
      </section>

      <section aria-labelledby="green-room-recovery-heading">
        <p className="evidence-label">{sections.recovery.status}</p>
        <h3 id="green-room-recovery-heading">{sections.recovery.title}</h3>
        <p>{sections.recovery.body}</p>
      </section>

      <section className="green-room-research__links" aria-labelledby="green-room-links-heading">
        <h3 id="green-room-links-heading">Continue the evidence trail</h3>
        <ul>{guide.plannedLinks.map((slug) => <li key={slug}><Link href={`/${slug}`}>{plannedLinkLabels[slug] ?? slug}</Link></li>)}</ul>
      </section>
    </section>
  );
}

export function RouteOverview({ guide }: { guide: Guide }) {
  const routeSummary = 'routeSummary' in guide ? guide.routeSummary : undefined;
  const radioChannels = 'radioChannels' in guide ? guide.radioChannels : undefined;
  if (!routeSummary?.length && !radioChannels?.length) return null;

  return (
    <section className="route-overview" aria-labelledby="route-overview-heading">
      <p className="hint-block__kicker">Quick answer</p>
      <h2 id="route-overview-heading">Route at a glance</h2>
      <p>{guide.goal}</p>
      {radioChannels?.length ? (
        <div className="route-recovery__table-wrap">
          <table>
            <thead>
              <tr><th>Channel</th><th>Location</th><th>Unlock</th><th>Official mix and tracks</th></tr>
            </thead>
            <tbody>
              {radioChannels.map((channel) => (
                <tr key={channel.number}>
                  <th scope="row">{channel.number}. {channel.area}</th>
                  <td>{channel.location}</td>
                  <td>{channel.unlock}</td>
                  <td><strong>{channel.officialMix}</strong><br />{channel.tracks.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ol className="route-summary">
          {routeSummary?.map((stage) => <li key={stage}>{stage}</li>)}
        </ol>
      )}
    </section>
  );
}

function recommendationTarget(slug: string) {
  if (slug === 'home') return { href: '/', title: 'Big Walk Walkthrough home' };
  if (slug === 'puzzles') return { href: '/puzzles', title: 'Big Walk Puzzle Directory' };
  const target = guides.find((entry) => entry.slug === slug);
  return target ? { href: `/${target.slug}`, title: target.h1 } : undefined;
}

export function NextStepRecommendations({ guide }: { guide: Guide }) {
  const recommendations = guide.relatedSlugs
    .map((related) => ({ related, target: recommendationTarget(related.slug) }))
    .filter((entry): entry is { related: Guide['relatedSlugs'][number]; target: { href: string; title: string } } => Boolean(entry.target));

  if (!recommendations.length) return null;

  return (
    <section className="next-steps" aria-labelledby="next-steps-heading">
      <p className="hint-block__kicker">CHOOSE YOUR NEXT MOVE</p>
      <h2 id="next-steps-heading">What to do next</h2>
      <div className="next-step-grid">
        {recommendations.map(({ related, target }) => (
          <Link className="next-step-card" href={target.href} key={related.slug}>
            <span>{related.relationType}</span>
            <strong>{target.title}</strong>
            <p>{related.reason}</p>
            <small>Continue <span aria-hidden="true">→</span></small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function GuideToc({ guide }: { guide: Guide }) {
  const hasPuzzleOverview = 'directAnswer' in guide
    && 'progressiveHints' in guide
    && 'navigationMethods' in guide;

  return (
    <nav className="guide-toc" aria-label="On this page">
      <p>On this page</p>
      {'routeSummary' in guide ? <a href="#route-overview-heading">Route overview</a> : null}
      <a href="#hint-heading">Hint</a>
      {hasPuzzleOverview ? <a href="#before-you-start">Before you start</a> : null}
      {hasPuzzleOverview ? <a href="#quick-answer">Quick answer</a> : null}
      {hasPuzzleOverview ? <a href="#navigation-methods">Navigation methods</a> : null}
      <a href="#next-steps-heading">Next steps</a>
      <a href="#verification-heading">Solution and sources</a>
    </nav>
  );
}

export function VerificationPanel({ guide, showVideo = true }: { guide: Guide; showVideo?: boolean }) {
  const isPublished = guide.indexable;
  const recoveryHeading = 'recoveryHeading' in guide && typeof guide.recoveryHeading === 'string'
    ? guide.recoveryHeading
    : 'If the route stalls';

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
          <h3 id={`recovery-${guide.slug.replaceAll('/', '-')}`}>{recoveryHeading}</h3>
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
          {guide.sources.map((source) => {
            const purpose = 'purpose' in source ? source.purpose : undefined;
            return (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>{' '}
                <span>— {source.publisher}</span>
                {purpose ? <p>{purpose}</p> : null}
              </li>
            );
          })}
        </ul>
      </section>
      {showVideo ? <VideoEvidence guide={guide} /> : null}
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

export function VideoEvidence({ guide }: { guide: Guide }) {
  if (!('video' in guide) || !guide.video) return null;

  const startAt = 'startAt' in guide.video ? guide.video.startAt : undefined;
  const watchUrl = 'watchUrl' in guide.video ? guide.video.watchUrl : undefined;
  const linkLabel = 'linkLabel' in guide.video ? guide.video.linkLabel : 'Watch this evidence video on YouTube';
  return (
    <section className="guide-video" aria-labelledby={`video-${guide.slug.replaceAll('/', '-')}`}>
      <h3 id={`video-${guide.slug.replaceAll('/', '-')}`}>{guide.video.title}</h3>
      <p>{guide.video.note}</p>
      <YouTubeEmbed id={guide.video.id} title={guide.video.title} startAt={startAt} />
      {watchUrl ? <p><a href={guide.video.watchUrl} target="_blank" rel="noreferrer">{linkLabel}</a></p> : null}
    </section>
  );
}

export function Breadcrumbs({ guide }: { guide: Guide }) {
  const isPuzzle = guide.kind === 'puzzle';
  const isWalkthrough = guide.kind === 'walkthrough';

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link href="/">Home</Link></li>
        {isPuzzle ? <li><Link href="/puzzles">Puzzles</Link></li> : null}
        {isWalkthrough ? <li><Link href="/walkthrough">Walkthroughs</Link></li> : null}
        <li aria-current="page">{guide.h1}</li>
      </ol>
    </nav>
  );
}

export function RelatedGuides({ guide }: { guide: Guide }) {
  const sameKind = guides.filter((entry) => entry.kind === guide.kind);
  const currentIndex = sameKind.findIndex((entry) => entry.slug === guide.slug);
  const previous = currentIndex > 0 ? sameKind[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < sameKind.length - 1 ? sameKind[currentIndex + 1] : undefined;
  const directory = guide.kind === 'puzzle'
    ? { href: '/puzzles', title: 'Big Walk Puzzle Directory' }
    : { href: '/walkthrough', title: 'Big Walk Walkthrough Route Center' };

  return (
    <section className="related-guides" aria-labelledby="related-guides-heading">
      <h2 id="related-guides-heading">Related guides</h2>
      <div className="related-guide-grid">
        {previous ? <Link href={`/${previous.slug}`}><span>Previous</span><strong>{previous.h1}</strong></Link> : null}
        {next ? <Link href={`/${next.slug}`}><span>Next</span><strong>{next.h1}</strong></Link> : null}
        <Link href={directory.href}><span>Browse all</span><strong>{directory.title}</strong></Link>
      </div>
    </section>
  );
}

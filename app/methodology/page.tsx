import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeading, SiteFooter, SiteHeader } from '../../components/site';

export const metadata: Metadata = {
  title: {
    absolute: 'Big Walk Methodology: Evidence Gate and Publishable Solutions',
  },
  description:
    'How this Big Walk directory separates spoiler-light hints, source-checked routes, first-hand captures, and noindex evidence pages.',
  alternates: { canonical: '/methodology' },
  robots: { index: false, follow: true },
  openGraph: {
    url: '/methodology',
    title: 'Big Walk Methodology: Evidence Gate and Publishable Solutions',
    description:
      'How this Big Walk directory separates spoiler-light hints, source-checked routes, first-hand captures, and noindex evidence pages.',
  },
  twitter: {
    card: 'summary',
    title: 'Big Walk Methodology: Evidence Gate and Publishable Solutions',
    description:
      'How this Big Walk directory separates spoiler-light hints, source-checked routes, first-hand captures, and noindex evidence pages.',
  },
};

export default function MethodologyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-reference" aria-labelledby="methodology-title">
          <div className="page-shell home-reference__inner">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <ol><li><Link href="/">Home</Link></li><li aria-current="page">Methodology</li></ol>
            </nav>

            <p className="eyebrow">EDITORIAL METHOD</p>
            <h1 id="methodology-title">How to use this Big Walk directory</h1>
            <p className="section-intro">
              This page explains how the directory keeps spoiler-light hints, source-checked routes, first-hand
              captures, and evidence-in-progress pages distinct.
            </p>

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
                <h2>Choose the right world size</h2>
                <p>
                  Before starting a session, the host selects a 2-player, 3-player, or 4+ world. The official FAQ says
                  that parts of the world adapt to that choice, so a walkthrough must record the player-count variant
                  it was tested in.
                </p>
              </article>
              <article>
                <h2>Keep the same host in mind</h2>
                <p>
                  Big Walk saves progress automatically for the host. When a group resumes, the host needs to start the
                  session again; this is useful context when a player reports that an unlocked route or collected item
                  does not appear in a different session.
                </p>
              </article>
              <article>
                <h2>Communication is part of the puzzle</h2>
                <p>
                  The game is designed around its in-game voice and text chat. Distance, sound barriers, tools, and
                  player positions can all change how a group shares information, so guide steps should describe roles
                  rather than assume everyone sees the same thing.
                </p>
              </article>
              <article>
                <h2>Use a guide at the right depth</h2>
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

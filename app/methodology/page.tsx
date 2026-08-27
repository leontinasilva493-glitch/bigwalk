import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialArtwork } from '../../components/editorial-artwork';
import { SectionHeading, SiteFooter, SiteHeader } from '../../components/site';

export const metadata: Metadata = {
  title: {
    absolute: 'Big Walk Guide Methodology: Sources, Spoilers and Updates',
  },
  description:
    'How this Big Walk directory cites official game information, guide articles, and original player discussions while keeping spoilers and disputed reports clear.',
  alternates: { canonical: '/methodology' },
  robots: { index: false, follow: true },
  openGraph: {
    url: '/methodology',
    title: 'Big Walk Guide Methodology: Sources, Spoilers and Updates',
    description:
      'How this Big Walk directory cites official game information, guide articles, and original player discussions while keeping spoilers and disputed reports clear.',
    images: [{
      url: '/images/editorial/big-walk-methodology-guide-workflow.webp',
      width: 1536,
      height: 1024,
      alt: 'Big Walk guide methodology workflow with source research, cross-checking, and local field verification on an island map',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Big Walk Guide Methodology: Sources, Spoilers and Updates',
    description:
      'How this Big Walk directory cites official game information, guide articles, and original player discussions while keeping spoilers and disputed reports clear.',
    images: ['/images/editorial/big-walk-methodology-guide-workflow.webp'],
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

            <header className="editorial-page-hero editorial-page-hero--wide">
              <div className="editorial-page-hero__copy">
                <p className="eyebrow">EDITORIAL METHOD</p>
                <h1 id="methodology-title">How to use this Big Walk directory</h1>
                <p className="section-intro">
                  This page explains how the directory uses official game information, guide articles, and original
                  player discussions without hiding source limits or spoiling more than you asked for.
                </p>
              </div>
              <EditorialArtwork
                src="/images/editorial/big-walk-methodology-guide-workflow.webp"
                alt="Big Walk guide methodology workflow with source research, cross-checking, and local field verification on an island map"
                variant="methodology"
                placement="hero"
                preload
                sizes="(max-width: 900px) calc(100vw - 40px), 880px"
              />
            </header>

            <div className="home-reference__intro">
              <p>
                Big Walk is built around the conversations a group has while exploring. A useful guide should help you
                get unstuck without turning the whole island into a checklist. Start with the visible clue you have — a
                colour, object, number, building, or landmark — and use the directory to find the closest matching
                entry. Each entry is filed under a practical path such as a tower, area, item, or achievement, so you
                can follow the vocabulary your group is already using rather than guess an in-game puzzle name.
              </p>
              <p>
                Start with the spoiler-free hint: it points your group back toward a clue or interaction without stating
                an answer. Detailed walkthroughs name their official, editorial, or player sources and include relevant
                player-count and version context. Pages whose source reports disagree stay out of search indexing.
              </p>
              <p>
                That distinction matters in an open-world co-op game. A good hint lets players keep communicating and
                experimenting together. A premature solution can be wrong for the session type, hide an important
                discovery, or send a group across the map for an object that is not available in their version of the
                world. Use the hint first, decide together how much help you want, then return for the detailed guide
                only when its source notes explain where the route comes from and what can vary.
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
                  linked, step-by-step route.
                </p>
              </article>
            </div>

            <div className="home-reference__body">
              <h2>What makes a solution publishable?</h2>
              <p>
                A publishable solution on this site is not a paraphrase of a single comment. It needs a clear starting
                state, named source links, a reproducible route, and relevant player-count or version context. Reports
                that conflict or lack enough detail remain noindex research pages until stronger sources resolve them.
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
                Source names and review dates help readers distinguish official rules, guide-writer routes, player
                reports, and older recordings. Version notes identify details that may have changed after a game update.
              </p>
              <p>
                For general setup, saving, accessibility, joining a host, cross-play, and the game&apos;s communication
                model, read the <a href="https://bigwalk.game/faq/">official Big Walk FAQ</a>. This directory links to
                the same practical questions in its beginner, multiplayer, and troubleshooting hubs, while reserving
                puzzle-answer claims for pages with enough linked support to describe a stable route.
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
                  <p>Use the available hint as orientation; disputed solutions stay in research notes rather than being presented as fact.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Open the full route</h3>
                  <p>Read the detailed steps, then use the named source links and review date when a result differs in your world.</p>
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

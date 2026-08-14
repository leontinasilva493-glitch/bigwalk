import Link from 'next/link';
import { JsonLd } from './json-ld';
import { SiteFooter, SiteHeader } from './site';
import { Walker } from './game-elements';
import { VideoAfterLinks, VideoJumpLink } from './guides';
import { YouTubeEmbed } from './youtube-embed';
import { site } from '../lib/content.mjs';

type Status = 'Official-confirmed' | 'Source-checked' | 'Community-reported' | 'To verify';
type LabelledItem = { title: string; body: string; status: Status };

export type BeginnerPage = {
  slug: string;
  h1: string;
  description: string;
  updated: string;
  verificationLabel: string;
  beginnerGuide: {
    intro: string[];
    quickStart: LabelledItem[];
    officialVideo: { id: string; title: string; duration: string; watchUrl: string };
    videoIntro: string;
    hosting: string[];
    worldSizes: Array<{ label: string; bestFor: string; guidance: string; status: Status }>;
    firstTenMinutes: LabelledItem[];
    communication: LabelledItem[];
    separation: { intro: string; status: Status; steps: string[] };
    carryFirst: LabelledItem[];
    firstRoute: { intro: string; steps: Array<{ title: string; body: string }> };
    mistakes: Array<{ title: string; body: string }>;
    faqs: Array<{ question: string; answer: string; status: Status }>;
    communityVideos: Array<{ title: string; url: string; status: Status; note: string }>;
    relatedLinks: Array<{ href: string; title: string; body: string }>;
    evidenceNotes: LabelledItem[];
    sources: Array<{ title: string; publisher: string; url: string }>;
  };
};

function EvidenceLabel({ status }: { status: Status }) {
  return <span className="beginner-status" data-status={status}>{status}</span>;
}

export function BeginnerGuideArticle({ page }: { page: BeginnerPage }) {
  const content = page.beginnerGuide;
  const canonicalUrl = `${site.url}/${page.slug}`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.description,
    dateModified: page.updated,
    mainEntityOfPage: canonicalUrl,
    publisher: { '@type': 'Organization', name: site.name },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: page.h1, item: canonicalUrl },
    ],
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <SiteHeader active="beginner" />
      <main className="guide-page beginner-guide-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol><li><Link href="/">Home</Link></li><li aria-current="page">Beginner Guide</li></ol>
        </nav>
        <article className="guide-article beginner-guide-article">
          <header id="guide-top" className="guide-hero beginner-guide-hero">
            <div className="beginner-guide-hero__walker" aria-hidden="true"><Walker color="orange" pose="walk" /></div>
            <p className="verification-status" role="status">{page.verificationLabel}</p>
            <p className="guide-kicker">Spoiler-light first-session handbook</p>
            <h1>{page.h1}</h1>
            <p className="guide-description">{page.description}</p>
            <p className="guide-meta">Updated {page.updated} · No puzzle solutions · Official and community evidence separated</p>
            <VideoJumpLink href="#official-video" />
            <div className="beginner-guide-intro">{content.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </header>

          <aside id="guide-start" className="guide-toc" aria-label="On this page">
            <p>On this page</p>
            <a href="#before-you-invite">Before you invite</a>
            <a href="#official-video">Official video</a>
            <a href="#hosting-and-world-size">Host and world size</a>
            <a href="#first-ten-minutes">First 10 minutes</a>
            <a href="#communication">Communication</a>
            <a href="#separated">If separated</a>
            <a href="#what-to-do-first">What to do first</a>
            <a href="#beginner-faq">FAQ</a>
          </aside>

          <section className="beginner-section beginner-quick-start" aria-labelledby="before-you-invite">
            <p className="hint-block__kicker">QUICK ANSWER</p>
            <h2 id="before-you-invite">Before you invite friends</h2>
            <div className="beginner-card-grid beginner-card-grid--quick">
              {content.quickStart.map((item, index) => (
                <article key={item.title}>
                  <span className="beginner-card-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <EvidenceLabel status={item.status} />
                </article>
              ))}
            </div>
          </section>

          <section className="beginner-section beginner-video-section" aria-labelledby="official-video">
            <p className="hint-block__kicker">WATCH FIRST</p>
            <h2 id="official-video">Watch the official gameplay overview</h2>
            <p>{content.videoIntro}</p>
            <YouTubeEmbed id={content.officialVideo.id} title={content.officialVideo.title} />
            <p className="beginner-video-meta"><EvidenceLabel status="Official-confirmed" /> {content.officialVideo.duration}</p>
            <VideoAfterLinks watchUrl={content.officialVideo.watchUrl} sourceLabel="Watch the official gameplay overview on YouTube" />
          </section>

          <section className="beginner-section" aria-labelledby="hosting-and-world-size">
            <p className="hint-block__kicker">SET UP THE SESSION</p>
            <h2 id="hosting-and-world-size">Hosting, saves, and choosing a world size</h2>
            {content.hosting.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="beginner-inline-link"><Link href="/multiplayer/transfer-save-to-new-host">See how to transfer a save to a new host →</Link></p>
            <div className="beginner-table-wrap">
              <table>
                <thead><tr><th>World</th><th>Best for</th><th>How to choose</th><th>Evidence</th></tr></thead>
                <tbody>{content.worldSizes.map((world) => (
                  <tr key={world.label}>
                    <th scope="row">{world.label}</th><td>{world.bestFor}</td><td>{world.guidance}</td><td><EvidenceLabel status={world.status} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </section>

          <section className="beginner-section" aria-labelledby="first-ten-minutes">
            <p className="hint-block__kicker">FIRST-SESSION CHECKLIST</p>
            <h2 id="first-ten-minutes">Your first 10 minutes</h2>
            <ol className="beginner-checklist">
              {content.firstTenMinutes.map((item) => (
                <li key={item.title}><div><h3>{item.title}</h3><p>{item.body}</p><EvidenceLabel status={item.status} /></div></li>
              ))}
            </ol>
          </section>

          <section className="beginner-section" aria-labelledby="communication">
            <p className="hint-block__kicker">CORE MENTAL MODEL</p>
            <h2 id="communication">Communication is part of the puzzle</h2>
            <p>Big Walk is most distinctive when the group works with limited contact instead of bypassing it. Use the game’s channels first, and make your signals understandable before the party needs them.</p>
            <div className="beginner-card-grid">
              {content.communication.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.body}</p><EvidenceLabel status={item.status} /></article>)}
            </div>
          </section>

          <section className="beginner-section beginner-regroup" aria-labelledby="separated">
            <p className="hint-block__kicker">LOST-PARTY PROTOCOL</p>
            <h2 id="separated">What to do if your group gets separated</h2>
            <p>{content.separation.intro}</p>
            <EvidenceLabel status={content.separation.status} />
            <ol>{content.separation.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          </section>

          <section className="beginner-section" aria-labelledby="what-to-do-first">
            <p className="hint-block__kicker">PACK LIGHT, THEN EXPLORE</p>
            <h2 id="what-to-do-first">What to carry and what to do first</h2>
            <h3>Useful first carries</h3>
            <div className="beginner-card-grid beginner-card-grid--three">
              {content.carryFirst.map((item) => <article key={item.title}><h4>{item.title}</h4><p>{item.body}</p><EvidenceLabel status={item.status} /></article>)}
            </div>
            <h3 className="beginner-route-heading">A spoiler-light opening route</h3>
            <p>{content.firstRoute.intro}</p>
            <ol className="beginner-route">
              {content.firstRoute.steps.map((step) => <li key={step.title}><div><h4>{step.title}</h4><p>{step.body}</p></div></li>)}
            </ol>
          </section>

          <section className="beginner-section" aria-labelledby="first-session-mistakes">
            <p className="hint-block__kicker">AVOIDABLE FRICTION</p>
            <h2 id="first-session-mistakes">First-session mistakes</h2>
            <div className="beginner-mistakes">
              {content.mistakes.map((mistake) => <article key={mistake.title}><h3>{mistake.title}</h3><p>{mistake.body}</p></article>)}
            </div>
          </section>

          <section className="beginner-section" aria-labelledby="beginner-faq">
            <p className="hint-block__kicker">QUICK ANSWERS</p>
            <h2 id="beginner-faq">Big Walk beginner FAQ</h2>
            <div className="beginner-faq-list">
              {content.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p><EvidenceLabel status={faq.status} /></details>)}
            </div>
          </section>

          <section className="beginner-section beginner-evidence" aria-labelledby="sources-and-verification">
            <p className="hint-block__kicker">EVIDENCE STATUS</p>
            <h2 id="sources-and-verification">Sources, videos, and what still needs testing</h2>
            <div className="beginner-card-grid">
              {content.evidenceNotes.map((note) => <article key={note.title}><EvidenceLabel status={note.status} /><h3>{note.title}</h3><p>{note.body}</p></article>)}
            </div>
            <h3>Optional community videos</h3>
            <div className="beginner-video-links">
              {content.communityVideos.map((video) => <article key={video.url}><EvidenceLabel status={video.status} /><h4><a href={video.url} target="_blank" rel="noreferrer">{video.title}</a></h4><p>{video.note}</p></article>)}
            </div>
            <h3>Research sources</h3>
            <ul className="beginner-source-list">
              {content.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> <span>— {source.publisher}</span></li>)}
            </ul>
            <h3>Continue from here</h3>
            <div className="beginner-related-grid">
              {content.relatedLinks.map((link) => <Link href={link.href} key={link.href}><strong>{link.title}</strong><span>{link.body}</span></Link>)}
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

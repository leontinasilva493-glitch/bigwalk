import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AnswerFirstPuzzleGuide, Breadcrumbs, CoordinatesFirstScreen, GuideRoleAssignments, GuideSources, GuideToc, HintBlock, NextStepRecommendations, PuzzleMvpOverview, RelatedGuides, SearchIntentPanel, VerificationPanel, VideoEvidence, VideoJumpLink } from '../../../components/guides';
import { JsonLd } from '../../../components/json-ld';
import { SiteFooter, SiteHeader } from '../../../components/site';
import { guideBySlug, guides, site } from '../../../lib/content.mjs';

type PageProps = { params: Promise<{ slug: string[] }> };

function getGuide(params: { slug: string[] }) {
  return guideBySlug(`puzzles/${params.slug.join('/')}`);
}

export function generateStaticParams() {
  return guides
    .filter((guide) => guide.kind === 'puzzle')
    .map((guide) => ({ slug: guide.slug.replace('puzzles/', '').split('/') }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = getGuide(await params);
  if (!guide) return {};

  return {
    title: { absolute: guide.title },
    description: guide.description,
    alternates: { canonical: `/${guide.slug}` },
    robots: { index: guide.indexable, follow: true },
    openGraph: {
      url: `/${guide.slug}`,
      title: guide.title,
      description: guide.description,
    },
    twitter: {
      card: 'summary',
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function PuzzleGuidePage({ params }: PageProps) {
  const guide = getGuide(await params);
  if (!guide || guide.kind !== 'puzzle') notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.h1,
    description: guide.description,
    dateModified: guide.updated,
    mainEntityOfPage: `${site.url}/${guide.slug}`,
    publisher: { '@type': 'Organization', name: site.name },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Puzzles', item: `${site.url}/puzzles` },
      { '@type': 'ListItem', position: 3, name: guide.h1, item: `${site.url}/${guide.slug}` },
    ],
  };
  const usesAnswerFirstMvp = 'answerFirstMvp' in guide && Boolean(guide.answerFirstMvp);

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader active="puzzles" />
      <main className="guide-page">
        <Breadcrumbs guide={guide} />
        <article className="guide-article">
          <header id="guide-top" className="guide-hero">
            <p className="verification-status" role="status">{guide.verificationLabel}</p>
            <p className="guide-kicker">{guide.category} puzzle · {guide.area}</p>
            <h1>{guide.h1}</h1>
            <p className="guide-description">{guide.description}</p>
            <p className="guide-meta">{guide.readTime} · Updated {guide.updated} · {guide.lastVerified}</p>
            {('video' in guide && guide.video) ? <VideoJumpLink href={`#video-${guide.slug.replaceAll('/', '-')}`} /> : null}
          </header>
          <GuideToc guide={guide} />
          {!usesAnswerFirstMvp ? (
            <>
              <SearchIntentPanel guide={guide} />
              <GuideRoleAssignments guide={guide} />
              <CoordinatesFirstScreen guide={guide} />
              <HintBlock guide={guide} />
              <PuzzleMvpOverview guide={guide} />
              <NextStepRecommendations guide={guide} />
              <VideoEvidence guide={guide} />
              <VerificationPanel guide={guide} showVideo={false} />
            </>
          ) : (
            <>
              <AnswerFirstPuzzleGuide guide={guide} />
              <NextStepRecommendations guide={guide} />
              <GuideSources guide={guide} />
            </>
          )}
          <RelatedGuides guide={guide} />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

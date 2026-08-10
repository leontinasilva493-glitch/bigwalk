import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs, GreenRoomResearch, HintBlock, RelatedGuides, RouteOverview, VerificationPanel, VideoEvidence } from '../../../components/guides';
import { JsonLd } from '../../../components/json-ld';
import { SectionHeading, SiteFooter, SiteHeader } from '../../../components/site';
import { guideBySlug, guides, site } from '../../../lib/content.mjs';

type PageProps = { params: Promise<{ slug: string[] }> };

function getGuide(params: { slug: string[] }) {
  return guideBySlug(`walkthrough/${params.slug.join('/')}`);
}

export function generateStaticParams() {
  return guides
    .filter((guide) => guide.kind === 'walkthrough')
    .map((guide) => ({ slug: guide.slug.replace('walkthrough/', '').split('/') }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = getGuide(await params);
  if (!guide) return {};

  return {
    title: 'absoluteTitle' in guide && guide.absoluteTitle ? { absolute: guide.title } : guide.title,
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

export default async function WalkthroughGuidePage({ params }: PageProps) {
  const guide = getGuide(await params);
  if (!guide || guide.kind !== 'walkthrough') notFound();

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
      { '@type': 'ListItem', position: 2, name: guide.h1, item: `${site.url}/${guide.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader active="walkthrough" />
      <main className="guide-page">
        <Breadcrumbs guide={guide} />
        <article className="guide-article">
          <header className="guide-hero">
            <p className="verification-status" role="status">{guide.verificationLabel}</p>
            <p className="guide-kicker">{guide.category} walkthrough · {guide.area}</p>
            <h1>{guide.h1}</h1>
            <p className="guide-description">{guide.description}</p>
            {'introNote' in guide && guide.introNote ? <p className="guide-intro-note">{guide.introNote}</p> : null}
            <p className="guide-meta">{guide.readTime} · Updated {guide.updated} · {guide.lastVerified}</p>
          </header>
          <aside className="guide-toc" aria-label="On this page">
            <p>On this page</p>
            {'routeSummary' in guide ? <a href="#route-overview-heading">Route overview</a> : null}
            <a href="#hint-heading">Hint</a>
            <a href="#verification-heading">Solution and sources</a>
          </aside>
          <GreenRoomResearch guide={guide} />
          <RouteOverview guide={guide} />
          <HintBlock guide={guide} />
          <VideoEvidence guide={guide} />
          <VerificationPanel guide={guide} showVideo={false} />
          <SectionHeading kicker="Keep exploring" title="Related Big Walk guides" />
          <RelatedGuides relatedSlugs={guide.relatedSlugs} />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

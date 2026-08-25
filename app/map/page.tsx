import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '../../components/json-ld';
import { MapExplorer } from '../../components/map-explorer';
import { SiteFooter, SiteHeader } from '../../components/site';
import { site } from '../../lib/content.mjs';
import { mapCategories, mapPoints, mapSources } from '../../lib/map-content.mjs';

const title = 'Big Walk Interactive Map — Towers, Puzzles & Checklist';
const description = 'Use a searchable Big Walk schematic map to filter towers, puzzles, transport, items, and ending locations, open source-checked guides, and track completion locally.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/map' },
  robots: { index: true, follow: true },
  openGraph: { url: '/map', title, description },
  twitter: { card: 'summary', title, description },
};

export default function MapPage() {
  const url = `${site.url}/map`;
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url,
    dateModified: '2026-08-25',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: mapPoints.length,
      itemListElement: mapPoints.map((point, index) => ({ '@type': 'ListItem', position: index + 1, name: point.name, item: `${site.url}${point.href}` })),
    },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Map', item: url },
    ],
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={breadcrumb} />
      <SiteHeader active="map" />
      <main className="map-page">
        <nav className="breadcrumbs page-shell" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Interactive Map</li></ol></nav>
        <header className="map-hero page-shell">
          <p className="verification-status">Original field-map interface · updated 2026-08-25</p>
          <p className="guide-kicker">TOWERS · PUZZLES · TRANSPORT · CHECKLIST</p>
          <h1>Big Walk Interactive Map</h1>
          <p>{description}</p>
          <div className="map-hero__notice"><strong>Spoiler-first choice:</strong> ending markers are hidden by default. This is an original schematic guide map, not the in-game terrain image and not a pixel-accurate replacement for getting lost with friends.</div>
        </header>

        <div className="page-shell"><MapExplorer points={mapPoints} categories={mapCategories} /></div>

        <section className="map-notes page-shell" aria-labelledby="map-room-markers-heading">
          <div>
            <p className="hint-block__kicker">READ THE IN-GAME MAP</p>
            <h2 id="map-room-markers-heading">Map Room markers</h2>
            <p>Current player reports say a small blue flag marks a completed puzzle. A tilted marker without the flag can mean the reward was collected but has not yet been deposited. Use the in-game Map Room as the host-save source of truth; use this checklist to remember which guide or landmark to revisit.</p>
          </div>
          <div>
            <p className="hint-block__kicker">WHEN TO USE THIS MAP</p>
            <h2>Keep first-session discovery intact</h2>
            <p>Community feedback repeatedly recommends natural exploration for a first walk. The map is most useful when a group is backtracking, missing one object, planning a short session, or auditing 100% completion.</p>
          </div>
        </section>

        <section className="guide-sources page-shell" aria-labelledby="map-sources-heading">
          <h2 id="map-sources-heading">Map sources and boundaries</h2>
          <ul>{mapSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> <span>— {source.publisher}</span><p>{source.note}</p></li>)}</ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

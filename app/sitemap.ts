import type { MetadataRoute } from 'next';
import { guides, site } from '../lib/content.mjs';

const discoveryEntries = [
  { path: '/', lastModified: new Date('2026-08-08') },
  { path: '/puzzles', lastModified: new Date('2026-08-08') },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const verifiedGuideEntries = guides
    .filter((guide) => guide.indexable)
    .map((guide) => ({ path: `/${guide.slug}`, lastModified: new Date(guide.updated) }));

  return [...discoveryEntries, ...verifiedGuideEntries].map((entry) => ({
    url: `${site.url}${entry.path}`,
    lastModified: entry.lastModified,
  }));
}

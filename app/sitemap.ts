import type { MetadataRoute } from 'next';
import { guides, site, siteSections } from '../lib/content.mjs';
import { buildSitemapEntries } from '../lib/sitemap-content.mjs';

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries({ guides, siteSections }).map((entry) => ({
    url: `${site.url}${entry.path}`,
    lastModified: new Date(entry.lastModified),
  }));
}

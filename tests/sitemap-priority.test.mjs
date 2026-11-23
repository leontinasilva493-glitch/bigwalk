import test from 'node:test';
import assert from 'node:assert/strict';

import { guides, siteSections } from '../lib/content.mjs';
import { buildSitemapEntries, sitemapPriorityPaths } from '../lib/sitemap-content.mjs';

const p0Paths = [...sitemapPriorityPaths.P0];
const p1Paths = [...sitemapPriorityPaths.P1];

test('sitemap puts the high-demand P0 acquisition pages first', () => {
  const entries = buildSitemapEntries({ guides, siteSections });

  assert.deepEqual(entries.slice(0, p0Paths.length).map((entry) => entry.path), p0Paths);
  assert.ok(entries.slice(0, p0Paths.length).every((entry) => entry.priorityBand === 'P0'));
  assert.ok(entries.slice(p0Paths.length).every((entry) => entry.priorityBand !== 'P0'));
});

test('sitemap keeps supporting routes in P1 with zero unranked stragglers', () => {
  const entries = buildSitemapEntries({ guides, siteSections });
  const p1Start = p0Paths.length;

  assert.deepEqual(entries.slice(p1Start).map((entry) => entry.path), p1Paths);
  assert.ok(entries.slice(p1Start).every((entry) => entry.priorityBand === 'P1'));
});

test('sitemap includes all 23 pure indexable canonicals and excludes pruned/legal routes', () => {
  const entries = buildSitemapEntries({ guides, siteSections });
  const paths = entries.map((entry) => entry.path);
  const expectedContentPaths = [
    ...guides.filter((entry) => entry.indexable).map((entry) => `/${entry.slug}`),
    ...siteSections.filter((entry) => entry.indexable).map((entry) => `/${entry.slug}`),
  ];
  const excludedPaths = [
    '/methodology',
    '/patch-notes',
    '/multiplayer/how-to-find-players',
    '/troubleshooting',
    '/puzzles/purple-things-where-to-use',
    '/walkthrough/green-room',
    '/privacy',
    '/terms',
    '/contact',
  ];

  assert.equal(entries.length, 23);
  assert.equal(new Set(paths).size, entries.length);
  for (const path of expectedContentPaths) assert.ok(paths.includes(path), `${path} should be discoverable`);
  for (const path of excludedPaths) assert.ok(!paths.includes(path), `${path} must stay out of sitemap`);
});

import test from 'node:test';
import assert from 'node:assert/strict';

import { guides, siteSections } from '../lib/content.mjs';
import { buildSitemapEntries } from '../lib/sitemap-content.mjs';

const p0Paths = [
  '/',
  '/map',
  '/patch-notes',
  '/puzzles',
  '/walkthrough',
  '/achievements',
  '/puzzles/blue-platform-four-piece',
  '/puzzles/heavy-ball',
  '/walkthrough/black-tower',
  '/walkthrough/true-ending',
  '/puzzles/colored-pegboard',
  '/puzzles/purple-challenges',
];

const p1Paths = [
  '/beginner-guide',
  '/multiplayer',
  '/multiplayer/how-to-find-players',
  '/puzzles/peg-puzzle',
  '/puzzles/green-chair-headphones',
  '/puzzles/4166-1899-coordinates',
  '/puzzles/black-sphere',
  '/walkthrough/red-tower-map-room',
  '/walkthrough/blue-tower-train',
  '/walkthrough/green-tower-chairlift',
  '/walkthrough/yellow-tower-tunnels',
];

const p2Paths = [
  '/walkthrough/crosswalk',
  '/walkthrough/radio-channels',
];

test('sitemap puts the approved P0 acquisition pages first', () => {
  const entries = buildSitemapEntries({ guides, siteSections });

  assert.deepEqual(entries.slice(0, p0Paths.length).map((entry) => entry.path), p0Paths);
  assert.ok(entries.slice(0, p0Paths.length).every((entry) => entry.priorityBand === 'P0'));
  assert.ok(entries.slice(p0Paths.length).every((entry) => entry.priorityBand !== 'P0'));
});

test('sitemap keeps established guides in P1 and supporting routes in P2', () => {
  const entries = buildSitemapEntries({ guides, siteSections });
  const p1Start = p0Paths.length;
  const p2Start = p1Start + p1Paths.length;

  assert.deepEqual(entries.slice(p1Start, p2Start).map((entry) => entry.path), p1Paths);
  assert.ok(entries.slice(p1Start, p2Start).every((entry) => entry.priorityBand === 'P1'));
  assert.deepEqual(entries.slice(p2Start).map((entry) => entry.path), p2Paths);
  assert.ok(entries.slice(p2Start).every((entry) => entry.priorityBand === 'P2'));
});

test('sitemap includes every indexable canonical exactly once and excludes noindex routes', () => {
  const entries = buildSitemapEntries({ guides, siteSections });
  const paths = entries.map((entry) => entry.path);
  const expectedContentPaths = [
    ...guides.filter((entry) => entry.indexable).map((entry) => `/${entry.slug}`),
    ...siteSections.filter((entry) => entry.indexable).map((entry) => `/${entry.slug}`),
  ];
  const noindexPaths = [
    ...guides.filter((entry) => !entry.indexable).map((entry) => `/${entry.slug}`),
    ...siteSections.filter((entry) => !entry.indexable).map((entry) => `/${entry.slug}`),
    '/methodology',
  ];

  assert.equal(entries.length, 25);
  assert.equal(new Set(paths).size, entries.length);
  for (const path of expectedContentPaths) assert.ok(paths.includes(path), `${path} should be discoverable`);
  for (const path of noindexPaths) assert.ok(!paths.includes(path), `${path} must stay out of sitemap`);
});

test('significantly updated P0 pages publish accurate lastmod dates', () => {
  const entries = buildSitemapEntries({ guides, siteSections });
  const lastModifiedByPath = new Map(entries.map((entry) => [entry.path, entry.lastModified]));

  for (const path of p0Paths) {
    const expected = path === '/patch-notes'
      ? '2026-08-26'
      : ['/puzzles', '/walkthrough/true-ending'].includes(path)
        ? '2026-08-28'
        : '2026-08-25';
    assert.equal(lastModifiedByPath.get(path), expected, `${path} should advertise its significant update`);
  }
});

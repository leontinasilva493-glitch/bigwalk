import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { guides, siteSections } from '../lib/content.mjs';
import { buildSitemapEntries } from '../lib/sitemap-content.mjs';

const routeFiles = [
  '../app/puzzles/purple-challenges/page.tsx',
  '../app/multiplayer/page.tsx',
  '../app/walkthrough/page.tsx',
  '../app/beginner-guide/page.tsx',
  '../app/achievements/page.tsx',
];

test('the consolidated v3 hubs exist with zero orphan draft routes', async () => {
  const exists = await Promise.all(routeFiles.map((routeFile) =>
    access(new URL(routeFile, import.meta.url)).then(() => true, () => false)));
  assert.ok(exists.every(Boolean));
});

test('all surviving guide and section records are indexable and corroborated', () => {
  assert.ok(guides.every((guide) => (
    guide.indexable === true
    && Array.isArray(guide.aliases)
    && Array.isArray(guide.visualCues)
    && Array.isArray(guide.nearbyLandmarks)
    && guide.worldVariants
    && Array.isArray(guide.sources)
    && guide.status === 'published'
  )));
  assert.deepEqual(
    siteSections.map((section) => section.slug).sort(),
    ['achievements', 'beginner-guide', 'multiplayer', 'puzzles/purple-challenges', 'walkthrough'],
  );
  assert.ok(siteSections.every((section) => section.indexable === true && section.status === 'published'));
});

test('walkthrough directory has publishable metadata and enters generated sitemap discovery', () => {
  const walkthrough = siteSections.find((section) => section.slug === 'walkthrough');
  const sitemapPaths = buildSitemapEntries({ guides, siteSections }).map((entry) => entry.path);

  assert.equal(walkthrough?.status, 'published');
  assert.equal(walkthrough?.evidenceLevel, 'corroborated');
  assert.equal(walkthrough?.verificationLabel, 'Published routes with linked sources');
  assert.match(walkthrough?.title ?? '', /Walkthroughs/);
  assert.ok(sitemapPaths.includes('/walkthrough'));
});

test('topic pages use the shared source template and derive indexing from evidence state', async () => {
  const source = await readFile(new URL('../components/evidence-page.tsx', import.meta.url), 'utf8');
  assert.match(source, /robots: \{ index: page\.indexable, follow: true \}/);
  assert.doesNotMatch(source, /page\.verificationLabel/);
  assert.match(source, /PrimarySources/);
});

test('navigation prioritizes crawl equity for top hubs and high-impression unindexed guides', async () => {
  const source = await readFile(new URL('../components/site.tsx', import.meta.url), 'utf8');

  assert.match(source, /\{ href: '\/walkthrough', label: 'Walkthroughs', key: 'walkthrough' \}/);
  assert.match(source, /\{ href: '\/achievements', label: 'Achievements', key: 'achievements' \}/);
  assert.match(source, /\{ href: '\/puzzles\/peg-puzzle', label: 'Forget-Me-Not Puzzle'/);
  assert.match(source, /\{ href: '\/puzzles\/green-chair-headphones', label: 'Music Chair & Headphones'/);
  assert.match(source, /\{ href: '\/walkthrough\/true-ending', label: 'True Ending & Silver Key'/);
  assert.doesNotMatch(source, /\/troubleshooting|\/patch-notes/);
});

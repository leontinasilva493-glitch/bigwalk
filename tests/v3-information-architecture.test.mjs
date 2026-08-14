import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { guides, siteSections } from '../lib/content.mjs';

const routeFiles = [
  '../app/puzzles/purple-challenges/page.tsx',
  '../app/multiplayer/page.tsx',
  '../app/multiplayer/hosting-and-saves/page.tsx',
  '../app/multiplayer/transfer-save-to-new-host/page.tsx',
  '../app/multiplayer/how-to-find-players/page.tsx',
  '../app/troubleshooting/page.tsx',
  '../app/troubleshooting/cant-rejoin-after-disconnect/page.tsx',
  '../app/troubleshooting/voice-chat-not-working/page.tsx',
  '../app/troubleshooting/crossplay-switch-2/page.tsx',
  '../app/troubleshooting/white-screen-and-crash/page.tsx',
  '../app/beginner-guide/can-you-play-solo/page.tsx',
];

test('the approved v3 hubs and topic routes exist', async () => {
  await Promise.all(routeFiles.map((routeFile) => access(new URL(routeFile, import.meta.url))));
});

test('guide records expose the v3 evidence model and visual aliases', () => {
  assert.ok(guides.every((guide) => (
    Array.isArray(guide.aliases)
    && Array.isArray(guide.visualCues)
    && Array.isArray(guide.nearbyLandmarks)
    && guide.worldVariants
    && Array.isArray(guide.sources)
    && ['draft', 'published', 'research', 'verified', 'outdated'].includes(guide.status)
    && ['not_collected', 'first_hand', 'corroborated', 'conflicting_reports'].includes(guide.evidenceLevel)
  )));
  assert.ok(siteSections.some((section) => section.slug === 'puzzles/purple-challenges'));
  assert.equal(siteSections.find((section) => section.slug === 'puzzles/purple-challenges').indexable, true);
  assert.equal(siteSections.find((section) => section.slug === 'beginner-guide').indexable, true);
  assert.equal(siteSections.find((section) => section.slug === 'achievements')?.indexable, true);
  assert.equal(siteSections.find((section) => section.slug === 'multiplayer')?.indexable, true);
  assert.equal(siteSections.find((section) => section.slug === 'walkthrough')?.indexable, true);
  const publishedSectionSlugs = new Set([
    'achievements',
    'beginner-guide',
    'multiplayer',
    'multiplayer/how-to-find-players',
    'puzzles/purple-challenges',
    'walkthrough',
  ]);
  assert.ok(siteSections
    .filter((section) => !publishedSectionSlugs.has(section.slug))
    .every((section) => section.indexable === false));
});

test('walkthrough directory has publishable metadata and enters generated sitemap discovery', async () => {
  const walkthrough = siteSections.find((section) => section.slug === 'walkthrough');
  const sitemap = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');

  assert.equal(walkthrough?.status, 'published');
  assert.equal(walkthrough?.evidenceLevel, 'corroborated');
  assert.equal(walkthrough?.verificationLabel, 'Source-checked walkthrough directory');
  assert.match(walkthrough?.title ?? '', /Walkthroughs/);
  assert.doesNotMatch(walkthrough?.title ?? '', /Verification in Progress/i);
  assert.match(sitemap, /siteSections\s*\.filter\(\(section\)\s*=>\s*section\.indexable\)/);
});

test('new topic pages use the shared evidence template and derive indexing from evidence state', async () => {
  const source = await readFile(new URL('../components/evidence-page.tsx', import.meta.url), 'utf8');
  assert.match(source, /robots: \{ index: page\.indexable, follow: true \}/);
  assert.match(source, /page\.verificationLabel/);
  assert.match(source, /What we still need to verify/);
});

test('primary navigation leads with player intents and keeps lower-priority topics secondary', async () => {
  const source = await readFile(new URL('../components/site.tsx', import.meta.url), 'utf8');

  assert.match(source, /\{ href: '\/walkthrough', label: 'Walkthroughs', key: 'walkthrough' \}/);
  assert.match(source, /\{ href: '\/troubleshooting', label: 'Help & Fixes', key: 'help' \}/);
  assert.match(source, /const secondaryNavigation/);
  assert.match(source, /\{ href: '\/achievements', label: 'Achievements', key: 'achievements' \}/);
  assert.match(source, /\{ href: '\/puzzles\/purple-challenges', label: 'Purple Challenges', key: 'purple-challenges' \}/);
});

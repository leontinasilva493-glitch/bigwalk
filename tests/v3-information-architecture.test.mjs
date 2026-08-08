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

test('the approved v3 hubs and evidence-gated topic routes exist', async () => {
  await Promise.all(routeFiles.map((routeFile) => access(new URL(routeFile, import.meta.url))));
});

test('guide records expose the v3 evidence model and visual aliases', () => {
  assert.ok(guides.every((guide) => (
    Array.isArray(guide.aliases)
    && Array.isArray(guide.visualCues)
    && Array.isArray(guide.nearbyLandmarks)
    && guide.worldVariants
    && Array.isArray(guide.sources)
    && ['draft', 'verified', 'outdated'].includes(guide.status)
    && ['not_collected', 'first_hand', 'corroborated'].includes(guide.evidenceLevel)
  )));
  assert.ok(siteSections.some((section) => section.slug === 'puzzles/purple-challenges'));
  assert.ok(siteSections.every((section) => section.indexable === false));
});

test('new topic pages use the shared evidence template and stay out of indexing', async () => {
  const source = await readFile(new URL('../components/evidence-page.tsx', import.meta.url), 'utf8');
  assert.match(source, /robots: \{ index: false, follow: true \}/);
  assert.match(source, /Verification in progress/);
  assert.match(source, /What we still need to verify/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guideBySlug, guides, siteSectionBySlug, siteSections } from '../lib/content.mjs';
import { buildSitemapEntries } from '../lib/sitemap-content.mjs';

test('purple challenges is an indexable seven-challenge directory with evidence-gated facts', () => {
  const page = siteSectionBySlug('puzzles/purple-challenges');

  assert.equal(page.indexable, true);
  assert.equal(page.status, 'published');
  assert.equal(page.title, 'Purple Challenges in Big Walk — All 7 Listed with Locations');
  assert.equal(page.updated, '2026-08-25');
  assert.equal(page.challenges.length, 7);
  assert.ok(page.challenges.every((challenge) => (
    challenge.name
    && challenge.visualCues
    && challenge.position
    && challenge.prerequisiteItem
    && challenge.transport
    && challenge.playerCount
    && challenge.verificationStatus
  )));
  assert.ok(page.challenges.filter((challenge) => challenge.position !== 'Position TBD').length >= 3);
  assert.deepEqual(
    page.pendingFirstHand.map((fact) => fact.label),
    ['Purple set', 'Completion handoff', 'Result'],
  );
  assert.deepEqual(page.pendingFirstHand.map((fact) => fact.value), [
    '7 challenge rewards',
    '7 purple + 8 unused red rewards',
    'White Key for the split-sphere route',
  ]);
});

test('purple challenges keeps the shared evidence skeleton and enters generated sitemap discovery', async () => {
  const component = await readFile(new URL('../components/evidence-page.tsx', import.meta.url), 'utf8');
  const sitemapPaths = buildSitemapEntries({ guides, siteSections }).map((entry) => entry.path);

  assert.match(component, /challenge-directory/);
  assert.match(component, /page\.challenges/);
  assert.match(component, /page\.indexable/);
  assert.match(component, /page\.updated/);
  assert.ok(sitemapPaths.includes('/puzzles/purple-challenges'));
});

test('green room and purple-things research stubs are pruned and consolidated into canonical guides', () => {
  const sitemapPaths = buildSitemapEntries({ guides, siteSections }).map((entry) => entry.path);

  assert.equal(guideBySlug('walkthrough/green-room'), undefined);
  assert.equal(guideBySlug('puzzles/purple-things-where-to-use'), undefined);
  assert.ok(!sitemapPaths.includes('/walkthrough/green-room'));
  assert.ok(!sitemapPaths.includes('/puzzles/purple-things-where-to-use'));
  assert.ok(sitemapPaths.includes('/puzzles/purple-challenges'));
  assert.ok(sitemapPaths.includes('/walkthrough/true-ending'));
});

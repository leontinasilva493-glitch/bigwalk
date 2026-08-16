import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  guideBySlug,
  homepageDemandGuideSlugs,
} from '../lib/content.mjs';

test('true-ending demand page is complete but remains evidence-gated', () => {
  const guide = guideBySlug('walkthrough/true-ending');

  assert.ok(guide);
  assert.equal(guide.kind, 'walkthrough');
  assert.equal(guide.indexable, false);
  assert.equal(guide.status, 'research');
  assert.equal(guide.evidenceLevel, 'corroborated');
  assert.match(guide.title, /True Ending/i);
  assert.match(guide.description, /Big Game/i);
  assert.ok(guide.routeSummary.length >= 5);
  assert.ok(guide.solutionSteps.length >= 5);
  assert.ok(guide.commonFailures.length >= 3);
  assert.ok(guide.sources.length >= 3);
  assert.ok(guide.screenshotRequests.length >= 3);
  assert.ok(guide.relatedSlugs.some((related) => related.slug === 'walkthrough/green-room'));
  assert.ok(guide.relatedSlugs.some((related) => related.slug === 'puzzles/purple-challenges'));
});

test('peg-puzzle page disambiguates the visual query without creating an items hub', () => {
  const guide = guideBySlug('puzzles/peg-puzzle');

  assert.ok(guide);
  assert.equal(guide.kind, 'puzzle');
  assert.equal(guide.indexable, true);
  assert.equal(guide.status, 'published');
  assert.equal(guide.evidenceLevel, 'corroborated');
  assert.match(guide.title, /Forget-Me-Not Puzzle.*Peg Locations/i);
  assert.match(guide.description, /Forget-Me-Not/i);
  assert.ok(guide.aliases.includes('three finger puzzle'));
  assert.ok(guide.aliases.includes('sound peg'));
  assert.equal(guide.quickAnswerHeading, 'How the Forget-Me-Not peg puzzle works');
  assert.equal(guide.navigationHeading, 'Two ways to plan the return route');
  assert.ok(guide.progressiveHints.length >= 3);
  assert.ok(guide.navigationMethods.length >= 2);
  assert.ok(guide.solutionSteps.length >= 5);
  assert.ok(guide.commonFailures.length >= 3);
  assert.ok(guide.sources.length >= 3);
  assert.ok(guide.screenshotRequests.length >= 3);
});

test('demand pages stay curated while the useful Forget-Me-Not MVP enters the sitemap', async () => {
  const trueEnding = guideBySlug('walkthrough/true-ending');
  const pegPuzzle = guideBySlug('puzzles/peg-puzzle');
  const [sitemap, home] = await Promise.all([
    readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8'),
    readFile(new URL('../app/page.tsx', import.meta.url), 'utf8'),
  ]);

  assert.deepEqual(homepageDemandGuideSlugs, [
    'walkthrough/true-ending',
    'puzzles/peg-puzzle',
  ]);
  assert.ok(trueEnding.relatedSlugs.some((related) => related.slug === 'puzzles/peg-puzzle'));
  assert.ok(pegPuzzle.relatedSlugs.some((related) => related.slug === 'walkthrough/true-ending'));
  assert.match(sitemap, /guides\s*\.filter\(\(guide\)\s*=>\s*guide\.indexable\)/);
  assert.match(home, /homepageDemandGuideSlugs/);
  assert.match(home, /demandGuides\.map/);
  assert.match(home, /True ending and peg puzzle/i);
  assert.equal(trueEnding.indexable, false);
  assert.equal(pegPuzzle.indexable, true);
});

test('indexed achievements page has concrete guidance for every previously unfinished trophy', async () => {
  const source = await readFile(new URL('../app/achievements/page.tsx', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /\[to verify/i);
  assert.match(source, /Big Help[\s\S]*another player/i);
  assert.match(source, /Big Climb[\s\S]*highest-point station/i);
  assert.match(source, /Big Makeover[\s\S]*salon/i);
  assert.match(source, /Big Goodbye[\s\S]*first ending/i);
  assert.match(source, /Big Game[\s\S]*true ending/i);
  assert.match(source, /related:\s*'\/walkthrough\/true-ending'/);
  assert.match(source, /Normal ending vs true ending/i);
});

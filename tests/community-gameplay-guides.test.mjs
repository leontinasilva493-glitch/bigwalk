import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { guideBySlug, guides, siteSectionBySlug, siteSections } from '../lib/content.mjs';
import * as gameplayContent from '../lib/gameplay-demand-content.mjs';
import { buildSitemapEntries } from '../lib/sitemap-content.mjs';

const root = new URL('../', import.meta.url);

test('batch one publishes distinct Four-Piece and Heavy Ball task pages', () => {
  const fourPiece = guideBySlug('puzzles/blue-platform-four-piece');
  const heavyBall = guideBySlug('puzzles/heavy-ball');

  for (const guide of [fourPiece, heavyBall]) {
    assert.ok(guide);
    assert.equal(guide.kind, 'puzzle');
    assert.equal(guide.verificationStatus, 'source_checked');
    assert.equal(guide.status, 'published');
    assert.equal(guide.indexable, true);
    assert.equal(guide.gameVersion, '1.4.10');
    assert.ok(guide.sources.length >= 3);
    assert.ok(guide.solutionSteps.length >= 5);
    assert.ok(guide.commonFailures.length >= 3);
  }

  assert.ok(fourPiece.aliases.includes('moon on a stick puzzle'));
  assert.ok(fourPiece.aliases.includes('four inserts puzzle'));
  assert.match(fourPiece.directAnswer, /four|4/i);
  assert.match(fourPiece.directAnswer, /other puzzle/i);
  assert.match(fourPiece.searchIntent.answer, /Forget-Me-Not/i);

  assert.ok(heavyBall.aliases.includes('purple heavy ball puzzle'));
  assert.match(heavyBall.directAnswer, /train/i);
  assert.match(heavyBall.directAnswer, /chairlift/i);
  assert.match(JSON.stringify(heavyBall.navigationMethods), /mountain pass/i);
});

test('batch one gives Purple Challenges an answer-first intended access route', () => {
  const purple = siteSectionBySlug('puzzles/purple-challenges');

  assert.ok(purple.accessRoute);
  assert.match(purple.accessRoute.answer, /chairlift/i);
  assert.match(purple.accessRoute.answer, /purple tunnel/i);
  assert.match(purple.accessRoute.gate, /after.*ending|after.*credits/i);
  assert.ok(purple.accessRoute.checkpoints.length >= 4);
  assert.equal(purple.accessRoute.relatedHref, '/puzzles/heavy-ball');
});

test('batch one pages enter generated P0 discovery', () => {
  const entries = buildSitemapEntries({ guides, siteSections });
  const byPath = new Map(entries.map((entry) => [entry.path, entry]));

  for (const path of ['/puzzles/blue-platform-four-piece', '/puzzles/heavy-ball']) {
    assert.equal(byPath.get(path)?.priorityBand, 'P0');
  }
});

test('batch two publishes a Black Sphere page without stealing Black Tower or True Ending intent', () => {
  const sphere = guideBySlug('puzzles/black-sphere');

  assert.ok(sphere);
  assert.equal(sphere.verificationStatus, 'source_checked');
  assert.equal(sphere.status, 'published');
  assert.equal(sphere.indexable, true);
  assert.match(sphere.directAnswer, /Black Key.*Wall/i);
  assert.match(sphere.directAnswer, /Big Goodbye/i);
  assert.ok(sphere.sphereRooms.length >= 5);
  assert.ok(sphere.sphereRooms.every((room) => (
    room.name && room.visualCue && room.communication && room.hint && room.status
  )));
  assert.ok(sphere.sources.length >= 3);
  assert.ok(sphere.solutionSteps.length >= 6);
  assert.deepEqual(
    sphere.relatedSlugs.slice(0, 2).map((related) => related.slug),
    ['walkthrough/black-tower', 'walkthrough/true-ending'],
  );
  assert.ok(guideBySlug('walkthrough/black-tower').relatedSlugs.some((related) => related.slug === sphere.slug));
  assert.ok(guideBySlug('walkthrough/true-ending').relatedSlugs.some((related) => related.slug === sphere.slug));
});

test('batch two puzzle identifier routes players by visible reward state', () => {
  const choices = gameplayContent.puzzleIdentifierChoices;

  assert.ok(Array.isArray(choices));
  assert.deepEqual(choices.map((choice) => choice.id), [
    'reward-clamp',
    'listening-station',
    'map-marker',
    'unknown-landmark',
  ]);
  assert.equal(choices.find((choice) => choice.id === 'listening-station').href, '/walkthrough/radio-channels');
  assert.match(choices.find((choice) => choice.id === 'reward-clamp').answer, /puzzle/i);
  assert.match(choices.find((choice) => choice.id === 'map-marker').answer, /flag|tilted|upright/i);
});

test('batch two Radio Channels explains listening stations before the channel table', () => {
  const radio = guideBySlug('walkthrough/radio-channels');

  assert.ok(radio.routeNotice);
  assert.match(radio.routeNotice.heading, /puzzle/i);
  assert.match(radio.routeNotice.answer, /not.*puzzle/i);
  assert.equal(radio.routeNotice.relatedHref, '/puzzles/green-chair-headphones');
  assert.match(radio.routeNotice.relatedLabel, /Sound Check/i);
});

test('batch two Black Sphere page enters P1 discovery', () => {
  const entries = buildSitemapEntries({ guides, siteSections });
  const sphere = entries.find((entry) => entry.path === '/puzzles/black-sphere');

  assert.equal(sphere?.priorityBand, 'P1');
});

test('batch three explains the reusable coordinate-box mechanic before the fixed answer', () => {
  const coordinates = guideBySlug('puzzles/4166-1899-coordinates');

  assert.ok(coordinates.coordinateMechanic);
  assert.match(coordinates.coordinateMechanic.heading, /every coordinate box/i);
  assert.match(coordinates.coordinateMechanic.answer, /change as you move/i);
  assert.deepEqual(coordinates.coordinateMechanic.steps.map((step) => step.title), [
    'Read the target pair',
    'Choose GPS or map',
    'Move one axis at a time',
    'Hold remote objectives together',
  ]);
  assert.match(JSON.stringify(coordinates.coordinateMechanic), /X|horizontal/i);
  assert.match(JSON.stringify(coordinates.coordinateMechanic), /Y|vertical/i);
});

test('batch three ships an original pegboard search-zone locator with a visible accuracy boundary', async () => {
  const pegboard = guideBySlug('puzzles/colored-pegboard');
  const svg = await readFile(new URL('public/images/editorial/colored-pegboard-search-zones.svg', root), 'utf8');
  const route = await readFile(new URL('app/puzzles/[...slug]/page.tsx', root), 'utf8');

  assert.equal(pegboard.locatorImage.src, '/images/editorial/colored-pegboard-search-zones.svg');
  assert.equal(pegboard.locatorImage.width, 1200);
  assert.equal(pegboard.locatorImage.height, 760);
  assert.match(pegboard.locatorImage.caption, /search zones.*not exact spawn points/i);
  assert.match(svg, /Search zones/i);
  assert.match(svg, /not exact spawn points/i);
  assert.match(svg, /HIGH ROUTE/);
  assert.match(svg, /LOW \+ OUTER ROUTE/);
  assert.match(route, /GuideLocatorImage/);
});

test('batch three exposes shareable achievement anchors for high-demand trophy searches', async () => {
  const page = await readFile(new URL('app/achievements/page.tsx', root), 'utf8');

  assert.match(page, /aria-label="Jump to an achievement"/);
  assert.match(page, /href="#trophy-big-makeover"/);
  assert.match(page, /Big Shiny searches/);
  assert.match(page, /href="#trophy-big-goodbye"/);
  assert.match(page, /href="#trophy-big-game"/);
  assert.match(page, /href="#trophy-big-trophy"/);
});

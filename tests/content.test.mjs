import test from 'node:test';
import assert from 'node:assert/strict';
import { guides, guideBySlug, site } from '../lib/content.mjs';

test('the catalogue exposes the current puzzle and walkthrough records', () => {
  assert.equal(guides.length, 6);
  assert.equal(
    guideBySlug('puzzles/green-chair-headphones').h1,
    'Big Walk Sound Check Puzzle: Chair and Headphones Solution',
  );
  assert.equal(guideBySlug('missing'), undefined);
});

test('every guide declares its verification and original-image hand-off', () => {
  assert.ok(
    guides.every(
      (guide) =>
        guide.lastVerified &&
        guide.updated &&
        guide.readTime &&
        guide.imageAlt &&
        /^[a-z0-9-]+\.webp$/.test(guide.assetRequirement),
    ),
  );
  assert.deepEqual(guideBySlug('walkthrough/red-tower-map-room').relatedSlugs, [
    'puzzles/4166-1899-coordinates',
    'walkthrough/blue-tower-train',
    'home',
  ]);
});

test('every guide declares its tower evidence state', () => {
  assert.deepEqual(
    guides.map((guide) => guide.tower),
    [
      'Yellow Tower area',
      'Late-game completion area',
      'Red Tower map room',
      'Red Tower',
      'Blue Tower',
      'Opening area',
    ],
  );
});

test('the home taxonomy supplies all approved browse categories', () => {
  assert.deepEqual(site.taxonomy, ['tower', 'area', 'item', 'achievement']);
});

test('source-checked P0 guides declare complete publishable content and provenance', () => {
  const sourceChecked = guides.filter((guide) => guide.verificationStatus === 'source_checked');

  assert.deepEqual(
    sourceChecked.map((guide) => guide.slug),
    [
      'puzzles/green-chair-headphones',
      'puzzles/4166-1899-coordinates',
      'walkthrough/red-tower-map-room',
      'walkthrough/blue-tower-train',
      'walkthrough/crosswalk',
    ],
  );
  assert.ok(sourceChecked.every((guide) => (
    guide.indexable
    && /^\d{4}-\d{2}-\d{2}$/.test(guide.sourceCheckedAt)
    && guide.platforms.length > 0
    && guide.playerCount
    && guide.solutionSteps.length >= 3
    && guide.sources.length >= 2
    && guide.screenshotRequests.length >= 3
  )));
});

test('the Crosswalk opening route is complete enough for indexed discovery', () => {
  const crosswalk = guideBySlug('walkthrough/crosswalk');

  assert.equal(crosswalk.kind, 'walkthrough');
  assert.equal(crosswalk.indexable, true);
  assert.equal(crosswalk.status, 'published');
  assert.equal(crosswalk.evidenceLevel, 'corroborated');
  assert.equal(crosswalk.sourceCheckedAt, '2026-08-09');
  assert.ok(crosswalk.routeSummary.length >= 5);
  assert.ok(crosswalk.solutionSteps.length >= 6);
  assert.ok(crosswalk.commonFailures.length >= 4);
  assert.ok(crosswalk.sources.length >= 2);
  assert.deepEqual(crosswalk.relatedSlugs, [
    'walkthrough/red-tower-map-room',
    'puzzles',
  ]);
});

test('purple-things remains a useful but non-indexable evidence page while reports conflict', () => {
  const purpleThings = guideBySlug('puzzles/purple-things-where-to-use');

  assert.equal(purpleThings.verificationStatus, 'evidence_conflict');
  assert.equal(purpleThings.indexable, false);
  assert.match(purpleThings.evidenceNote, /conflict/i);
  assert.ok(purpleThings.sources.length >= 2);
  assert.ok(purpleThings.solutionSteps.length >= 3);
});

test('guide text remains free of malformed encoding', () => {
  const textValues = (value) => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(textValues);
    if (value && typeof value === 'object') return Object.values(value).flatMap(textValues);
    return [];
  };

  assert.ok(textValues(guides).every((text) => !text.includes('鈥?')));
});

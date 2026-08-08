import test from 'node:test';
import assert from 'node:assert/strict';
import { guides, guideBySlug, site } from '../lib/content.mjs';

test('the catalogue exposes the three puzzles and map-room walkthrough', () => {
  assert.equal(guides.length, 4);
  assert.equal(
    guideBySlug('puzzles/green-chair-headphones').h1,
    'Green Chair and Headphones: Hint & Verification Status',
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
  assert.deepEqual(guideBySlug('walkthrough/red-tower-map-room').relatedSlugs, ['home']);
});

test('every guide declares its tower evidence state', () => {
  assert.deepEqual(
    guides.map((guide) => guide.tower),
    [
      'Tower verification pending',
      'Tower verification pending',
      'Tower verification pending',
      'Red Tower',
    ],
  );
});

test('the home taxonomy supplies all approved browse categories', () => {
  assert.deepEqual(site.taxonomy, ['tower', 'area', 'item', 'achievement']);
});

test('the first-release catalogue keeps every placeholder explicitly evidence-gated', () => {
  assert.ok(guides.every((guide) => guide.verificationStatus === 'pending' && guide.indexable === false));
  const textValues = (value) => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(textValues);
    if (value && typeof value === 'object') return Object.values(value).flatMap(textValues);
    return [];
  };

  assert.ok(textValues(guides).every((text) => !text.includes('鈥?')));
});

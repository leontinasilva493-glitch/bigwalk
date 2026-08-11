import test from 'node:test';
import assert from 'node:assert/strict';
import { guideBySlug, guides } from '../lib/content.mjs';

const slug = 'walkthrough/blue-tower-train';

test('the Blue Tower train route is publishable and discoverable', () => {
  const guide = guideBySlug(slug);

  assert.ok(guide, 'expected the Blue Tower train guide to exist');
  assert.equal(guide.kind, 'walkthrough');
  assert.equal(guide.title, 'How to Start the Train in Big Walk | Big Ride Achievement');
  assert.equal(guide.h1, 'How to Start the Train in Big Walk');
  assert.equal(guide.verificationStatus, 'source_checked');
  assert.equal(guide.status, 'published');
  assert.equal(guide.evidenceLevel, 'corroborated');
  assert.equal(guide.indexable, true);
  assert.equal(guide.recoveryHeading, "If the train doesn't come");
  assert.equal(guide.screenshotRequests.length, 3);
  assert.ok(guide.routeSummary.length >= 4);
  assert.ok(guide.solutionSteps.length >= 5);
  assert.ok(guide.commonFailures.length >= 4);
  assert.ok(guide.sources.length >= 4);
  assert.ok(guide.relatedSlugs.some((related) => related.slug === 'walkthrough/red-tower-map-room'));
  assert.ok(guides.filter((entry) => entry.indexable).some((entry) => entry.slug === slug));
});

test('the Blue Tower train guide links only to verified public evidence', () => {
  const guide = guideBySlug(slug);
  const sourceUrls = new Set(guide?.sources.map((source) => source.url));

  assert.ok(sourceUrls.has('https://questdaily.com.au/walkthrough/guide-how-to-unlock-the-train-in-big-walk/'));
  assert.ok(sourceUrls.has('https://insider-gaming.com/big-walk-unlock-train-big-ride-achievement/'));
  assert.ok(sourceUrls.has('https://www.destructoid.com/how-to-unlock-and-activate-the-train-in-big-walk/'));
  assert.ok(sourceUrls.has('https://www.reddit.com/r/BigWalk/comments/1vf9oe3/big_walk_guides_unlockables_map_locations_items/'));
});

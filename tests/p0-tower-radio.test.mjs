import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guideBySlug, guides } from '../lib/content.mjs';

const today = '2026-08-10';

test('Green Tower chairlift guide matches the publishable tower-route contract', () => {
  const guide = guideBySlug('walkthrough/green-tower-chairlift');

  assert.ok(guide);
  assert.equal(guide.title, 'How to Unlock the Chairlift in Big Walk | Green Tower Route');
  assert.equal(guide.h1, 'How to Unlock the Chairlift in Big Walk');
  assert.ok(guide.description.length <= 155);
  assert.equal(guide.verificationStatus, 'source_checked');
  assert.equal(guide.status, 'published');
  assert.equal(guide.evidenceLevel, 'corroborated');
  assert.equal(guide.indexable, true);
  assert.equal(guide.updated, today);
  assert.equal(guide.routeSummary.length, 5);
  assert.equal(guide.solutionSteps.length, 5);
  assert.equal(guide.commonFailures.length, 5);
  assert.equal(guide.screenshotRequests.length, 3);
  assert.ok(guide.sources.length >= 4);
  assert.ok(guide.sources.every((source) => source.purpose));
  for (const slug of ['walkthrough/crosswalk', 'walkthrough/yellow-tower-tunnels', 'walkthrough/blue-tower-train']) {
    assert.ok(guide.relatedSlugs.some((related) => related.slug === slug));
  }
});

test('Yellow Tower tunnels guide matches the publishable tower-route contract', () => {
  const guide = guideBySlug('walkthrough/yellow-tower-tunnels');

  assert.ok(guide);
  assert.equal(guide.title, 'How to Unlock the Tunnels in Big Walk | Yellow Tower Route');
  assert.equal(guide.h1, 'How to Unlock the Tunnels in Big Walk');
  assert.ok(guide.description.length <= 155);
  assert.equal(guide.verificationStatus, 'source_checked');
  assert.equal(guide.status, 'published');
  assert.equal(guide.evidenceLevel, 'corroborated');
  assert.equal(guide.indexable, true);
  assert.equal(guide.updated, today);
  assert.equal(guide.routeSummary.length, 5);
  assert.equal(guide.solutionSteps.length, 5);
  assert.equal(guide.commonFailures.length, 5);
  assert.equal(guide.screenshotRequests.length, 3);
  assert.ok(guide.sources.length >= 4);
  assert.ok(guide.sources.every((source) => source.purpose));
  for (const slug of ['walkthrough/crosswalk', 'walkthrough/green-tower-chairlift', 'walkthrough/red-tower-map-room']) {
    assert.ok(guide.relatedSlugs.some((related) => related.slug === slug));
  }
});

test('radio channels guide lists seven official soundtrack groups and locations', () => {
  const guide = guideBySlug('walkthrough/radio-channels');

  assert.ok(guide);
  assert.equal(guide.title, 'All Radio Channels in Big Walk — Every Song & Location');
  assert.equal(guide.h1, 'All Radio Channels in Big Walk: Every Song, Located');
  assert.ok(guide.description.length <= 155);
  assert.equal(guide.verificationStatus, 'source_checked');
  assert.equal(guide.status, 'published');
  assert.equal(guide.evidenceLevel, 'corroborated');
  assert.equal(guide.indexable, true);
  assert.equal(guide.updated, today);
  assert.equal(guide.radioChannels.length, 7);
  assert.deepEqual(guide.radioChannels.map((channel) => channel.number), [1, 2, 3, 4, 5, 6, 7]);
  assert.ok(guide.radioChannels.every((channel) => (
    channel.location
    && channel.unlock
    && channel.officialMix
    && channel.tracks.length >= 2
  )));
  assert.equal(guide.solutionSteps.length, 7);
  assert.equal(guide.commonFailures.length, 5);
  assert.equal(guide.screenshotRequests.length, 3);
  assert.ok(guide.sources.length >= 2);
  assert.ok(guide.sources.every((source) => source.purpose));
  for (const slug of ['walkthrough/crosswalk', 'puzzles', 'walkthrough/green-tower-chairlift']) {
    assert.ok(guide.relatedSlugs.some((related) => related.slug === slug));
  }
  assert.ok(guides.filter((entry) => entry.indexable).some((entry) => entry.slug === guide.slug));
});

test('Crosswalk explains the drawbridge alias immediately after its description', async () => {
  const guide = guideBySlug('walkthrough/crosswalk');
  const route = await readFile(new URL('../app/walkthrough/[...slug]/page.tsx', import.meta.url), 'utf8');
  const expected = 'This raised bridge is also called the drawbridge by some players — it unlocks the same way either way: complete the four opening challenges, return their rewards to the beach control, and shape the gold key for the bridge lock.';

  assert.equal(guide.introNote, expected);
  assert.equal(guide.updated, today);
  assert.ok(route.indexOf('guide-description') < route.indexOf('guide.introNote'));
  assert.ok(route.indexOf('guide.introNote') < route.indexOf('<RouteOverview'));
});

test('shared walkthrough components render the radio table, source purposes, and per-video link labels', async () => {
  const components = await readFile(new URL('../components/guides.tsx', import.meta.url), 'utf8');

  assert.match(components, /radioChannels/);
  assert.match(components, /Official mix and tracks/);
  assert.match(components, /source\.purpose/);
  assert.match(components, /guide\.video\.linkLabel/);
});

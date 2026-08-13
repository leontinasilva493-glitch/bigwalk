import test from 'node:test';
import assert from 'node:assert/strict';
import * as content from '../lib/content.mjs';

test('Forget-Me-Not answers the visual query while remaining evidence-gated', () => {
  const guide = content.guideBySlug('puzzles/peg-puzzle');

  assert.ok(guide);
  assert.match(guide.h1, /Forget-Me-Not Puzzle/i);
  assert.equal(guide.indexable, false);
  assert.ok(guide.searchIntent);
  assert.match(guide.searchIntent.answer, /across the island/i);
  assert.match(guide.searchIntent.answer, /no universal fixed (set|order)/i);
  assert.deepEqual(
    guide.searchIntent.rows.map((row) => row.label),
    ['Sound', 'Gesture', 'Symbol', 'Dots / fingers'],
  );
  assert.deepEqual(Object.keys(guide.worldVariants), ['twoPlayer', 'threePlayer', 'fourPlus']);
  assert.ok(Object.values(guide.worldVariants).every(Boolean));
  assert.equal(guide.roleAssignments.length, 2);
  assert.ok(guide.commonFailures.some((failure) => /wrong slot|wrong peg/i.test(failure.problem)));
  assert.ok(guide.commonFailures.some((failure) => /return route|lost on the way back/i.test(failure.problem)));
  assert.deepEqual(
    guide.screenshotRequests.map((request) => request.label),
    ['Console overview', 'Current-world slots', 'Peg location', 'Completion result'],
  );
});

test('Sound Check recognizes music-chair searches without creating another route', () => {
  const guide = content.guideBySlug('puzzles/green-chair-headphones');

  assert.ok(guide);
  assert.ok(guide.aliases.includes('music chair puzzle'));
  assert.ok(guide.aliases.includes('musical chair puzzle'));
  assert.ok(guide.searchIntent);
  assert.equal(guide.searchIntent.heading, 'Is this the music chair puzzle?');
  assert.match(guide.searchIntent.answer, /sits in the chair/i);
  assert.match(guide.searchIntent.answer, /six microphones/i);
  assert.deepEqual(
    guide.searchIntent.rows.map((row) => row.label),
    ['Sound Check', 'Green Tower chairlift', 'Timer room'],
  );
  assert.ok(guide.prerequisites.some((item) => /beige-and-red archway/i.test(typeof item === 'string' ? item : item.text)));
  assert.equal(guide.roleAssignments.length, 2);
  assert.ok(guide.commonFailures.length >= 3);
});

test('walkthrough hub starts with the opening route and separates research routes', () => {
  assert.equal(typeof content.walkthroughHubGuides, 'function');
  const ordered = content.walkthroughHubGuides();
  const firstResearchIndex = ordered.findIndex((guide) => !guide.indexable);

  assert.equal(ordered[0].slug, 'walkthrough/crosswalk');
  assert.ok(firstResearchIndex > 0);
  assert.ok(ordered.slice(0, firstResearchIndex).every((guide) => guide.indexable));
  assert.ok(ordered.slice(firstResearchIndex).every((guide) => !guide.indexable));
  assert.ok(ordered.findIndex((guide) => guide.slug === 'walkthrough/true-ending') >= firstResearchIndex);

  const hub = content.siteSectionBySlug('walkthrough');
  assert.deepEqual(hub.startPaths.map((path) => path.label), [
    'First session',
    'Already on the island',
    'I only know what I saw',
  ]);
  assert.deepEqual(hub.progression.map((stage) => stage.title), [
    'Crosswalk',
    'Tower and transport unlocks',
    'Standard puzzle clean-up',
    'Purple Challenges',
    'Ending',
  ]);
});

test('topic hub cards report their real search-index status', () => {
  assert.equal(typeof content.topicHubStatusLabel, 'function');
  assert.equal(
    content.topicHubStatusLabel(content.siteSectionBySlug('walkthrough')),
    'Source-checked directory / indexed',
  );
  assert.equal(
    content.topicHubStatusLabel(content.siteSectionBySlug('troubleshooting')),
    'Evidence in progress / not indexed',
  );
});

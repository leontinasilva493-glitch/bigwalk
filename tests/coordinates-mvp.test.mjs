import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guideBySlug, guides } from '../lib/content.mjs';

const slug = 'puzzles/4166-1899-coordinates';

test('4166 1899 guide is a complete, indexable source-checked MVP', () => {
  const guide = guideBySlug(slug);

  assert.ok(guide);
  assert.equal(guide.indexable, true);
  assert.equal(guide.status, 'published');
  assert.equal(guide.title, 'Big Walk 4166, 1899 Puzzle Solution & Button Location');
  assert.equal(guide.h1, 'How to Solve 4166, 1899 in Big Walk');
  assert.match(guide.description, /Red Tower Map Room/);
  assert.match(guide.directAnswer, /map coordinates, not a keypad code/i);
  assert.equal(guide.sourceCheckedAt, '2026-08-10');
  assert.equal(guide.updated, '2026-08-10');

  assert.equal(guide.numberConfirmation.heading, 'Confirm the numbers first');
  assert.equal(
    guide.numberConfirmation.disambiguation,
    'Searched for 1466 or 3971? Those are usually a misremembered order or a live GPS readout — check the fixed sign on the orange building.',
  );
  assert.equal(guide.roleAssignments.length, 2);
  assert.deepEqual(guide.roleAssignments.map((role) => role.title), ['Player A', 'Player B']);
  assert.equal(guide.lostReward.status, 'To verify');
  assert.ok(guide.prerequisites.some((item) => item.href === '/walkthrough/red-tower-map-room'));

  assert.ok(guide.prerequisites.length >= 4);
  assert.ok(guide.progressiveHints.length >= 3);
  assert.ok(guide.navigationMethods.length >= 2);
  assert.ok(guide.solutionSteps.length >= 5);
  assert.ok(guide.commonFailures.length >= 5);
  assert.equal(guide.screenshotRequests.length, 4);
});

test('4166 1899 guide cites the supplied video without republishing its frames', () => {
  const guide = guideBySlug(slug);

  assert.equal(guide.video.id, '-oTJVxglRn4');
  assert.equal(guide.video.startAt, 420);
  assert.equal(guide.video.watchUrl, 'https://www.youtube.com/watch?v=-oTJVxglRn4&t=420s');
  assert.ok(guide.sources.some((source) => source.url === 'https://www.youtube.com/watch?v=-oTJVxglRn4'));
  assert.match(guide.video.note, /not republished/i);
  assert.ok(guide.screenshotRequests.every((request) => /Original/i.test(request.description)));
});

test('4166 1899 guide is connected to the map-room route and generated sitemap', async () => {
  const guide = guideBySlug(slug);
  const sitemapSource = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');

  assert.ok(guide.relatedSlugs.includes('walkthrough/red-tower-map-room'));
  assert.ok(guideBySlug('walkthrough/red-tower-map-room').relatedSlugs.includes(slug));
  assert.ok(guides.filter((item) => item.indexable).some((item) => item.slug === slug));
  assert.match(sitemapSource, /guides\s*\.filter\(\(guide\)\s*=>\s*guide\.indexable\)/);
});

test('puzzle template renders the MVP sections and timestamped video embed', async () => {
  const [routeSource, componentSource] = await Promise.all([
    readFile(new URL('../app/puzzles/[...slug]/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../components/guides.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(routeSource, /CoordinatesFirstScreen/);
  assert.match(routeSource, /PuzzleMvpOverview/);
  assert.match(routeSource, /title:\s*\{\s*absolute:\s*guide\.title\s*\}/);
  assert.match(routeSource, /#quick-answer/);
  assert.match(routeSource, /#before-you-start/);
  assert.match(routeSource, /#navigation-methods/);
  assert.match(componentSource, /guide\.directAnswer/);
  assert.match(componentSource, /guide\.prerequisites/);
  assert.match(componentSource, /guide\.progressiveHints/);
  assert.match(componentSource, /guide\.navigationMethods/);
  assert.match(componentSource, /guide\.numberConfirmation/);
  assert.match(componentSource, /guide\.roleAssignments/);
  assert.match(componentSource, /guide\.video\.startAt/);
  assert.match(componentSource, /guide\.video\.watchUrl/);
  assert.match(componentSource, /youtube-nocookie\.com/);
});

test('4166 video appears after progressive help and before the full solution panel', async () => {
  const [routeSource, componentSource] = await Promise.all([
    readFile(new URL('../app/puzzles/[...slug]/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../components/guides.tsx', import.meta.url), 'utf8'),
  ]);

  const firstScreenIndex = routeSource.indexOf('<CoordinatesFirstScreen');
  const overviewIndex = routeSource.indexOf('<PuzzleMvpOverview');
  const videoIndex = routeSource.indexOf('<VideoEvidence');
  const solutionIndex = routeSource.indexOf('<VerificationPanel');

  assert.ok(firstScreenIndex >= 0, 'number confirmation and prerequisites render near the hero');
  assert.ok(overviewIndex > firstScreenIndex, 'progressive help follows the first-screen preparation');
  assert.ok(videoIndex > overviewIndex, 'video follows the progressive help');
  assert.ok(solutionIndex > videoIndex, 'full text solution follows the video');
  assert.match(routeSource, /<VerificationPanel guide=\{guide\} showVideo=\{false\}/);
  assert.match(componentSource, /export function VideoEvidence/);
  assert.match(componentSource, /showVideo = true/);
});

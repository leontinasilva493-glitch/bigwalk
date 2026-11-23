import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function optionalSource(path) {
  try {
    return await readFile(new URL(path, import.meta.url), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return '';
    throw error;
  }
}

test('puzzle hub lets players choose spoiler depth and separates completion from reward delivery', async () => {
  const [content, catalogue, sitemap, page] = await Promise.all([
    import('../lib/gameplay-demand-content.mjs'),
    import('../lib/content.mjs'),
    import('../lib/sitemap-content.mjs'),
    optionalSource('../app/puzzles/page.tsx'),
  ]);

  assert.ok(content.puzzleHelpLevels);
  assert.ok(content.mapRoomPuzzleStates);
  assert.deepEqual(content.puzzleHelpLevels.map((level) => level.label), ['Hint', 'Nudge', 'Full solution']);
  assert.equal(content.mapRoomPuzzleStates.length, 3);
  assert.match(JSON.stringify(content.mapRoomPuzzleStates), /unfinished/i);
  assert.match(JSON.stringify(content.mapRoomPuzzleStates), /solved.*not.*delivered|not.*delivered.*solved/i);
  assert.match(JSON.stringify(content.mapRoomPuzzleStates), /completed.*delivered|delivered.*completed/i);
  assert.match(JSON.stringify(content.mapRoomPuzzleStates), /player.report|community/i);

  assert.match(page, /Choose how much help to reveal/);
  assert.match(page, /puzzleHelpLevels\.map/);
  assert.match(page, /Read the Map Room state/);
  assert.match(page, /mapRoomPuzzleStates\.map/);
  assert.match(page, /2-player, 3-player, or 4\+/);
  assert.match(page, /href="\/multiplayer#hosting"/);

  const puzzleEntry = sitemap.buildSitemapEntries({ guides: catalogue.guides, siteSections: catalogue.siteSections })
    .find((entry) => entry.path === '/puzzles');
  assert.equal(puzzleEntry.lastModified, '2026-11-23');
});

test('true ending guide answers safe continuation and exposes a same-host 100 percent checklist', async () => {
  const [catalogue, sitemap, route, components] = await Promise.all([
    import('../lib/content.mjs'),
    import('../lib/sitemap-content.mjs'),
    optionalSource('../app/walkthrough/[...slug]/page.tsx'),
    optionalSource('../components/guides.tsx'),
  ]);

  const guide = catalogue.guideBySlug('walkthrough/true-ending');
  assert.equal(guide.gameVersion, '1.5.0');
  assert.equal(guide.sourceCheckedAt, '2026-08-28');
  assert.equal(guide.updated, '2026-08-28');
  assert.match(guide.routeNotice.heading, /keep playing|continue/i);
  assert.match(guide.routeNotice.answer, /same host save/i);
  assert.match(guide.routeNotice.answer, /official.*does not|not.*official|community|completion sources/i);
  assert.equal(guide.completionChecklist.length, 7);
  assert.match(JSON.stringify(guide.completionChecklist), /Big Goodbye/);
  assert.match(JSON.stringify(guide.completionChecklist), /8 red/);
  assert.match(JSON.stringify(guide.completionChecklist), /7 purple/);
  assert.match(JSON.stringify(guide.completionChecklist), /White Key/);
  assert.match(JSON.stringify(guide.completionChecklist), /Big Game/);
  assert.match(JSON.stringify(guide.sources), /100 percented|100%|YouTube/i);

  assert.match(components, /export function CompletionChecklist/);
  assert.match(components, /guide\.completionChecklist/);
  assert.match(components, /completion-checklist-heading/);
  assert.match(route, /<CompletionChecklist guide=\{guide\}/);
  assert.ok(route.indexOf('<CompletionChecklist') < route.indexOf('<HintBlock'));

  const endingEntry = sitemap.buildSitemapEntries({ guides: catalogue.guides, siteSections: catalogue.siteSections })
    .find((entry) => entry.path === '/walkthrough/true-ending');
  assert.equal(endingEntry.lastModified, '2026-08-28');
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function sourceFor(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('homepage section labels describe player tasks instead of internal publishing stages', async () => {
  const home = await sourceFor('app/page.tsx');

  assert.match(home, /PUZZLE GUIDES/);
  assert.match(home, /POPULAR LATE-GAME HELP/);
  assert.doesNotMatch(home, /CURRENT ENTRIES|NEW DEMAND PAGES/);
});

test('puzzle directory sends achievement intent to the published trophy guide', async () => {
  const puzzles = await sourceFor('app/puzzles/page.tsx');

  assert.match(puzzles, /13 PS5 trophies/);
  assert.match(puzzles, /12 Steam achievements/);
  assert.match(puzzles, /href:\s*['"]\/achievements['"]/);
  assert.doesNotMatch(puzzles, /Verification pending|Coming soon/);
});

test('achievement page uses the current version source and hides internal capture tasks', async () => {
  const achievements = await sourceFor('app/achievements/page.tsx');

  assert.match(achievements, /currentVersion\.version/);
  assert.match(achievements, /Last verified on version/);
  assert.doesNotMatch(achievements, /Version 1\.4\.10|Original screenshot capture list/);
});

test('beginner guide links to verified host and save rules instead of a transfer placeholder', async () => {
  const beginner = await sourceFor('components/beginner-guide.tsx');

  assert.match(beginner, /href="\/multiplayer\/hosting-and-saves"/);
  assert.match(beginner, /current host and save rules/i);
  assert.doesNotMatch(beginner, /href="\/multiplayer\/transfer-save-to-new-host"/);
});

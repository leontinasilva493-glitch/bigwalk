import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function sourceFor(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('the standalone methodology route exists with static noindex metadata and the shared site shell', async () => {
  const route = '../app/methodology/page.tsx';

  await access(new URL(route, import.meta.url));

  const source = await sourceFor('app/methodology/page.tsx');

  assert.doesNotMatch(source, /['"]use client['"]/);
  assert.match(source, /export const metadata:\s*Metadata\s*=\s*\{/);
  assert.match(source, /alternates:\s*\{\s*canonical:\s*'\/methodology'\s*\}/);
  assert.match(source, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/);
  assert.match(source, /openGraph:\s*\{[\s\S]*url:\s*'\/methodology'/);
  assert.match(source, /<SiteHeader/);
  assert.match(source, /<SiteFooter/);
});

test('the homepage keeps discovery links but replaces the long methodology body with a concise teaser', async () => {
  const home = await sourceFor('app/page.tsx');
  const quickAnswers = home.indexOf('Current high-intent questions');
  const browseDirectory = home.indexOf('Browse the directory');
  const currentEntries = home.indexOf('Browse available hints');
  const unlockRoutes = home.indexOf('Browse available walkthroughs');
  const demandPages = home.indexOf('True ending and peg puzzle');
  const visualFinder = home.indexOf('Start with what you can see');
  const methodologyTeaser = home.indexOf('How to use this Big Walk directory');

  assert.match(home, /href="\/puzzles"/);
  assert.match(home, /href="\/walkthrough"/);
  assert.match(home, /href="\/methodology"/);
  assert.ok(quickAnswers < browseDirectory);
  assert.ok(browseDirectory < currentEntries);
  assert.ok(currentEntries < unlockRoutes);
  assert.ok(unlockRoutes < demandPages);
  assert.ok(demandPages < visualFinder);
  assert.ok(visualFinder < methodologyTeaser);
  assert.doesNotMatch(home, /What makes a solution publishable\?/);
  assert.doesNotMatch(home, /How It Works/);
  assert.doesNotMatch(home, /2-player, 3-player, or 4\+ world/);
});

test('the methodology page holds the moved evidence-policy and process content', async () => {
  const methodology = await sourceFor('app/methodology/page.tsx');

  assert.match(methodology, /How to use this Big Walk directory/);
  assert.match(methodology, /What makes a solution publishable\?/);
  assert.match(methodology, /How It Works/);
  assert.match(methodology, /2-player, 3-player, or 4\+ world/);
  assert.match(methodology, /https:\/\/bigwalk\.game\/faq\//);
  assert.match(methodology, /Find the moment/);
  assert.match(methodology, /Communication is part of the puzzle/);
});

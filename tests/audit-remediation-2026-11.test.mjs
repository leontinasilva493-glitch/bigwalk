import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { guideBySlug, guides } from '../lib/content.mjs';

const root = new URL('../', import.meta.url);

async function sourceFor(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('Adsterra native ad scripts and components are removed while legal pages and llms.txt exist', async () => {
  const siteShell = await sourceFor('components/site.tsx');
  assert.doesNotMatch(siteShell, /NativeAd|adsterra|profitableratecpmnetwork/i);
  assert.match(siteShell, /href="\/privacy"/);
  assert.match(siteShell, /href="\/terms"/);
  assert.match(siteShell, /href="\/contact"/);

  for (const route of [
    'app/privacy/page.tsx',
    'app/terms/page.tsx',
    'app/contact/page.tsx',
    'app/llms.txt/route.ts',
  ]) {
    await access(new URL(route, root));
  }
});

test('homepage embeds interactive ClueFinder and avoids Forget-Me-Not cannibalization or noindex leakage', async () => {
  const [home, puzzles, guidesComponent] = await Promise.all([
    sourceFor('app/page.tsx'),
    sourceFor('app/puzzles/page.tsx'),
    sourceFor('components/guides.tsx'),
  ]);

  assert.match(home, /<ClueFinder/);
  assert.doesNotMatch(home, /stored on the guide record/i);
  assert.doesNotMatch(puzzles, /Aliases improve discovery without creating thin duplicate pages/i);
  assert.doesNotMatch(guidesComponent, /Reveal the short solution/);
  assert.doesNotMatch(guidesComponent, /Reveal the full solution/);
});

test('GSC Page-1 keyword gaps (Silver Key, Amphitheater, Hearing Test, Station 6, 1466, Bowling Ball) are covered', () => {
  const ending = guideBySlug('walkthrough/true-ending');
  const chair = guideBySlug('puzzles/green-chair-headphones');
  const radio = guideBySlug('walkthrough/radio-channels');
  const coords = guideBySlug('puzzles/4166-1899-coordinates');
  const ball = guideBySlug('puzzles/heavy-ball');

  assert.ok(ending.aliases.includes('silver key'));
  assert.match(ending.directAnswer, /Silver Key/i);
  assert.ok(chair.aliases.includes('amphitheater puzzle'));
  assert.ok(chair.aliases.includes('hearing test'));
  assert.match(chair.directAnswer, /Amphitheater/i);
  assert.ok(radio.aliases.includes('station 6'));
  assert.ok(radio.aliases.includes('music 6'));
  assert.ok(coords.aliases.includes('1466'));
  assert.match(ball.title, /Bowling Ball/i);

  for (const guide of guides.filter((g) => g.indexable)) {
    const effectiveTitle = guide.absoluteTitle ? guide.title : guide.kind === 'puzzle' ? guide.title : `${guide.title} | Big Walk Walkthrough`;
    assert.ok(effectiveTitle.length <= 65, `${guide.slug} effective title too long (${effectiveTitle.length}): ${effectiveTitle}`);
  }
});

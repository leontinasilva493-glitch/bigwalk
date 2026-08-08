import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guides } from '../lib/content.mjs';

const root = new URL('../', import.meta.url);

async function sourceFor(path) {
  try {
    return await readFile(new URL(path, root), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return '';
    throw error;
  }
}

test('pending guide metadata makes no completed-solution claims', () => {
  const forbiddenClaims = /\bsolved\b|full walkthrough|exact location|step-by-step solution/i;

  for (const guide of guides) {
    assert.equal(guide.verificationStatus, 'pending', `${guide.slug} declares its pending evidence state`);
    assert.equal(guide.indexable, false, `${guide.slug} stays out of search until verified`);
    assert.doesNotMatch(`${guide.title}\n${guide.h1}\n${guide.description}`, forbiddenClaims, guide.slug);
    assert.doesNotMatch(guide.title, /\|\s*Big Walk$/, `${guide.slug} leaves the site suffix to the metadata template`);
  }
});

test('site metadata describes an evidence-gated directory and supplies social defaults', async () => {
  const layout = await sourceFor('app/layout.tsx');

  assert.match(layout, /default:\s*'Big Walk Hints & Puzzle Directory'/);
  assert.doesNotMatch(layout, /All Puzzles Solved/);
  assert.match(layout, /first-hand verification/i);
  assert.match(layout, /openGraph:/);
  assert.match(layout, /twitter:/);
});

test('indexable discovery pages declare canonical URLs without trailing-slash redirects', async () => {
  const [home, puzzles] = await Promise.all([
    sourceFor('app/page.tsx'),
    sourceFor('app/puzzles/page.tsx'),
  ]);

  assert.match(home, /alternates:\s*\{\s*canonical:\s*'\/'\s*\}/);
  assert.match(puzzles, /alternates:\s*\{\s*canonical:\s*'\/puzzles'\s*\}/);
});

test('unmatched routes have accurate noindex metadata', async () => {
  const notFound = await sourceFor('app/not-found.tsx');

  assert.match(notFound, /title:\s*'Page not found'/i);
  assert.match(notFound, /robots:\s*\{\s*index:\s*false/);
});

test('sitemap derives detail URLs only from indexable guide entries', async () => {
  const sitemap = await sourceFor('app/sitemap.ts');

  assert.match(sitemap, /guides\s*\.filter\(\(guide\)\s*=>\s*guide\.indexable\)/);
  assert.doesNotMatch(sitemap, /const publicPaths\s*=/);
});

test('directory and detail social metadata use their own canonical URLs', async () => {
  const [puzzles, detail] = await Promise.all([
    sourceFor('app/puzzles/page.tsx'),
    sourceFor('app/puzzles/[...slug]/page.tsx'),
  ]);

  assert.match(puzzles, /openGraph:\s*\{\s*url:\s*'\/puzzles'/);
  assert.match(detail, /openGraph:\s*\{\s*url:\s*`\/\$\{guide\.slug\}`/);
  assert.match(detail, /twitter:\s*\{/);
});

test('homepage presents verified content honestly and supplies a WebSite entity', async () => {
  const home = await sourceFor('app/page.tsx');

  assert.match(home, /'@type': 'WebSite'/);
  assert.match(home, /Big Walk Walkthrough: Hints &amp; Puzzle Guides/);
  assert.match(home, /Verified solutions and marked screenshots are added only after first-hand checks/i);
  assert.doesNotMatch(home, /Every Puzzle Solved/);
  assert.doesNotMatch(home, /SearchAction/);
});

test('the root route includes original social and browser metadata assets', async () => {
  const [ogImage, icon] = await Promise.all([
    sourceFor('app/opengraph-image.tsx'),
    sourceFor('app/icon.svg'),
  ]);

  assert.match(ogImage, /ImageResponse/);
  assert.match(ogImage, /width:\s*1200/);
  assert.match(ogImage, /Big Walk Walkthrough/);
  assert.match(icon, /<svg/);
  assert.match(icon, /#1e5b40/i);
});

test('homepage explains the evidence policy and version-sensitive co-op context', async () => {
  const home = await sourceFor('app/page.tsx');

  assert.match(home, /How to use this Big Walk directory/);
  assert.match(home, /2-player, 3-player, or 4\+ world/);
  assert.match(home, /bigwalk\.game\/faq/);
  assert.match(home, /What makes a solution publishable\?/);
});

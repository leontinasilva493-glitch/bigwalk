import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guideBySlug } from '../lib/content.mjs';
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

test('guide metadata only makes completed-solution claims for indexable source-checked pages', () => {
  const forbiddenClaims = /\bsolved\b|full walkthrough|exact location|step-by-step solution/i;

  for (const guide of guides) {
    if (!guide.indexable) {
      assert.doesNotMatch(`${guide.title}\n${guide.h1}\n${guide.description}`, forbiddenClaims, guide.slug);
    }
    assert.doesNotMatch(guide.title, /\|\s*Big Walk$/, `${guide.slug} leaves the site suffix to the metadata template`);
  }
});

test('site metadata describes an evidence-gated directory and supplies social defaults', async () => {
  const layout = await sourceFor('app/layout.tsx');

  assert.match(layout, /default:\s*'Big Walk Hints & Puzzle Directory'/);
  assert.doesNotMatch(layout, /All Puzzles Solved/);
  assert.match(layout, /Source-checked solutions/i);
  assert.match(layout, /original marked screenshots are added after local capture/i);
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

test('detail metadata receives both indexable and evidence-conflict guide states from its catalogue record', async () => {
  const detail = await sourceFor('app/puzzles/[...slug]/page.tsx');

  assert.match(detail, /robots:\s*\{\s*index:\s*guide\.indexable,\s*follow:\s*true\s*\}/);
  assert.doesNotMatch(detail, /robots:\s*\{\s*index:\s*false/);
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

test('homepage distinguishes source-checked solutions from later first-hand screenshot captures', async () => {
  const home = await sourceFor('app/page.tsx');

  assert.match(home, /'@type': 'WebSite'/);
  assert.match(home, /Big Walk Walkthrough: Hints &amp; Puzzle Guides/);
  assert.match(home, /Source-checked solutions/i);
  assert.match(home, /original marked screenshots/i);
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

test('the root layout initializes Microsoft Clarity after hydration', async () => {
  const layout = await sourceFor('app/layout.tsx');

  assert.match(layout, /import Script from 'next\/script'/);
  assert.match(layout, /id="microsoft-clarity"/);
  assert.match(layout, /strategy="afterInteractive"/);
  assert.match(layout, /https:\/\/www\.clarity\.ms\/tag\//);
  assert.match(layout, /xz3u8mp8w9/);
});

test('the Crosswalk route supplies indexable self-canonical metadata inputs', () => {
  const guide = guideBySlug('walkthrough/crosswalk');

  assert.equal(guide.title, 'How to Unlock the Crosswalk in Big Walk');
  assert.equal(guide.indexable, true);
  assert.equal(`/${guide.slug}`, '/walkthrough/crosswalk');
  assert.match(guide.description, /Crosswalk/);
  assert.doesNotMatch(`${guide.title}\n${guide.description}`, /secret ending/i);
});

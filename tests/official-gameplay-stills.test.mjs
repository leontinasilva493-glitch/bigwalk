import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import sharp from 'sharp';
import { guides } from '../lib/content.mjs';

const root = new URL('../', import.meta.url);
const pressKitUrl = 'https://bigwalk.game/presskit/';
const expectedMedia = new Map([
  ['puzzles/heavy-ball', 'big-walk-heavy-ball-carry.webp'],
  ['walkthrough/red-tower-map-room', 'big-walk-red-tower-puzzle-panel.webp'],
  ['walkthrough/blue-tower-train', 'big-walk-blue-tower-train.webp'],
  ['walkthrough/green-tower-chairlift', 'big-walk-green-tower-entrance.webp'],
  ['walkthrough/yellow-tower-tunnels', 'big-walk-yellow-tunnel-light-route.webp'],
]);

test('approved routes expose one relevant, attributed official gameplay still', async () => {
  for (const [slug, filename] of expectedMedia) {
    const guide = guides.find((entry) => entry.slug === slug);
    assert.ok(guide, `${slug} must remain in the guide catalogue`);
    assert.ok('locatorImage' in guide && guide.locatorImage, `${slug} must expose route media`);
    assert.equal(guide.locatorImage.src, `/images/gameplay/official/${filename}`);
    assert.equal(guide.locatorImage.sourceUrl, pressKitUrl);
    assert.match(guide.locatorImage.sourceLabel, /House House.*press kit/i);
    assert.ok(guide.locatorImage.caption.length >= 70, `${slug} caption must explain the player task shown`);
    assert.doesNotMatch(guide.locatorImage.caption, /decorative|placeholder|original capture target/i);

    const asset = new URL(`public${guide.locatorImage.src}`, root);
    await assert.doesNotReject(access(asset), `${slug} must reference an existing local WebP`);
    const metadata = await sharp(fileURLToPath(asset)).metadata();
    assert.equal(metadata.format, 'webp');
    assert.ok((metadata.width ?? 0) >= 600, `${slug} image must remain useful on desktop`);
    assert.ok((metadata.height ?? 0) >= 338, `${slug} image must remain useful on mobile`);
  }
});

test('walkthrough pages render the same locator media component as puzzle pages', async () => {
  const source = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('../app/walkthrough/[...slug]/page.tsx', import.meta.url), 'utf8')
  ));

  assert.match(source, /GuideLocatorImage/);
  assert.match(source, /<GuideLocatorImage guide=\{guide\}/);
});

test('routes without a truthful matching capture are not assigned unrelated press art', () => {
  for (const slug of [
    'puzzles/4166-1899-coordinates',
    'puzzles/black-sphere',
    'walkthrough/true-ending',
  ]) {
    const guide = guides.find((entry) => entry.slug === slug);
    assert.ok(guide, `${slug} must remain in the guide catalogue`);
    assert.ok(!('locatorImage' in guide) || !guide.locatorImage, `${slug} must wait for a matching route capture`);
  }
});

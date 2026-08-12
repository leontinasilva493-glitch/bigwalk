import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = {
  layout: '../app/layout.tsx',
  elements: '../components/game-elements.tsx',
  home: '../app/page.tsx',
  guides: '../components/guides.tsx',
  site: '../components/site.tsx',
  styles: '../app/globals.css',
};

async function source(name) {
  return readFile(new URL(files[name], import.meta.url), 'utf8');
}

test('the v1.2 visual system uses self-hosted fonts and original game elements', async () => {
  const [layout, elements, home, guides, site, styles] = await Promise.all(Object.keys(files).map(source));

  assert.match(layout, /@fontsource\/shantell-sans/);
  assert.match(layout, /@fontsource\/fredoka/);
  assert.match(layout, /@fontsource\/inter/);
  assert.doesNotMatch(layout, /next\/font\/google/);
  assert.match(styles, /--font-brand:\s*"Shantell Sans"/);
  assert.match(elements, /export function Walker/);
  assert.match(elements, /export function SignalFlareIcon/);
  assert.match(elements, /export function LanternWalker/);
  assert.match(home, /WalkerStack/);
  assert.match(guides, /SignalFlareIcon/);
  assert.match(site, /LanternWalker/);
  assert.match(styles, /--sky: #bfd9e2/);
  assert.match(styles, /\.walker-stack/);
  assert.match(styles, /\.spoiler-gate/);
  assert.match(styles, /\.site-footer\s*\{[^}]*position:\s*relative/);
});

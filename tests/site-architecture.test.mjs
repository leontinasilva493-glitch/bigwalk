import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const routeFiles = [
  '../app/beginner-guide/page.tsx',
  '../app/multiplayer/best-group-size/page.tsx',
  '../app/multiplayer/drop-in-host-save/page.tsx',
  '../app/achievements/page.tsx',
];

test('the documented second-wave routes exist before their verified content is added', async () => {
  await Promise.all(routeFiles.map((routeFile) => access(new URL(routeFile, import.meta.url))));
});

test('the desktop header contains four distinct document-backed destinations', async () => {
  const source = await readFile(new URL('../components/site.tsx', import.meta.url), 'utf8');

  for (const destination of ['/puzzles', '/beginner-guide', '/multiplayer/best-group-size', '/achievements']) {
    assert.match(source, new RegExp(`href=["']${destination}`));
  }
  assert.match(source, /<summary[^>]*aria-label="Open navigation"/);
});

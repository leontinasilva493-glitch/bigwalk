import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function bytesFor(path) {
  return readFile(new URL(path, root));
}

function pngSize(buffer) {
  assert.deepEqual(
    [...buffer.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
    'asset must be a PNG',
  );

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

test('favicon PNG assets expose the intended browser, Google, Apple, and app sizes', async () => {
  const expectedAssets = new Map([
    ['app/icon.png', 512],
    ['app/apple-icon.png', 180],
    ['public/icons/favicon-16x16.png', 16],
    ['public/icons/favicon-32x32.png', 32],
    ['public/icons/favicon-48x48.png', 48],
    ['public/icons/apple-touch-icon-180x180.png', 180],
    ['public/icons/icon-192x192.png', 192],
    ['public/icons/icon-512x512.png', 512],
    ['public/icons/big-walk-icon-master-1024.png', 1024],
  ]);

  for (const [path, expectedSize] of expectedAssets) {
    const dimensions = pngSize(await bytesFor(path));
    assert.deepEqual(dimensions, { width: expectedSize, height: expectedSize }, path);
  }
});

test('favicon.ico embeds square 16px, 32px, and 48px images', async () => {
  const icon = await bytesFor('app/favicon.ico');

  assert.equal(icon.readUInt16LE(0), 0, 'ICO reserved field');
  assert.equal(icon.readUInt16LE(2), 1, 'ICO image type');

  const count = icon.readUInt16LE(4);
  const sizes = [];
  for (let index = 0; index < count; index += 1) {
    const offset = 6 + index * 16;
    const width = icon[offset] || 256;
    const height = icon[offset + 1] || 256;
    const byteLength = icon.readUInt32LE(offset + 8);
    const imageOffset = icon.readUInt32LE(offset + 12);
    const embeddedPng = icon.subarray(imageOffset, imageOffset + byteLength);
    assert.equal(width, height, `ICO entry ${index + 1} must be square`);
    assert.equal(embeddedPng[25], 6, `ICO entry ${index + 1} must embed an RGBA PNG`);
    sizes.push(width);
  }

  assert.deepEqual(sizes.sort((a, b) => a - b), [16, 32, 48]);
});

test('web app manifest uses stable 192px and 512px icon URLs', async () => {
  const manifest = JSON.parse(await readFile(new URL('app/manifest.webmanifest', root), 'utf8'));

  assert.equal(manifest.name, 'Big Walk Walkthrough');
  assert.equal(manifest.short_name, 'Big Walk Guide');
  assert.deepEqual(
    manifest.icons.map(({ src, sizes, type }) => ({ src, sizes, type })),
    [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  );
});

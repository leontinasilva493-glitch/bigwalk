import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function sourceFor(path) {
  try {
    return await readFile(new URL(path, root), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return '';
    throw error;
  }
}

async function optionalImport(path) {
  try {
    return await import(path);
  } catch (error) {
    if (error?.code === 'ERR_MODULE_NOT_FOUND') return undefined;
    throw error;
  }
}

test('map points form a useful sourced schematic directory', async () => {
  const map = await optionalImport('../lib/map-content.mjs');
  assert.ok(map, 'map content module should exist');
  assert.ok(map.mapPoints.length >= 18);
  assert.equal(new Set(map.mapPoints.map((point) => point.id)).size, map.mapPoints.length);
  assert.ok(map.mapPoints.every((point) => (
    point.id
    && point.name
    && point.category
    && point.summary
    && point.sourceLabel
    && point.href.startsWith('/')
    && point.x >= 0 && point.x <= 100
    && point.y >= 0 && point.y <= 100
  )));
  assert.ok(map.mapPoints.some((point) => point.href === '/walkthrough/black-tower'));
  assert.ok(map.mapPoints.some((point) => point.href === '/puzzles/colored-pegboard'));
  assert.ok(map.mapPoints.some((point) => point.spoiler === true));
  assert.deepEqual(map.mapCategories.map((category) => category.id), ['all', 'progression', 'puzzle', 'transport', 'item', 'ending']);
});
test('map explorer exposes search filters spoilers and a local checklist', async () => {
  const component = await sourceFor('components/map-explorer.tsx');

  assert.match(component, /^'use client'/);
  assert.match(component, /aria-label="Search map locations"/);
  assert.match(component, /Show ending spoilers/);
  assert.match(component, /big-walk-map-v1/);
  assert.match(component, /localStorage/);
  assert.match(component, /Mark complete/);
  assert.match(component, /Reset checklist/);
  assert.match(component, /aria-live="polite"/);
});

test('map route is indexable crawlable and embeds the interactive explorer', async () => {
  const page = await sourceFor('app/map/page.tsx');

  assert.match(page, /canonical:\s*'\/map'/);
  assert.match(page, /robots:\s*\{\s*index:\s*true/);
  assert.match(page, /Big Walk Interactive Map/);
  assert.match(page, /<MapExplorer/);
  assert.match(page, /Map Room markers/);
  assert.match(page, /schematic/i);
  assert.match(page, /CollectionPage/);
});

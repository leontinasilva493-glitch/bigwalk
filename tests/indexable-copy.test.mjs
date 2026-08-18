import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guides, site, siteSections } from '../lib/content.mjs';

const forbiddenPhrases = [
  /source-checked against a current guide/i,
  /original local capture still required/i,
  /still needs its own current-version captures before describing this as first-hand verified/i,
  /community reports conflict/i,
  /not presented as an original capture from this site/i,
];

const textValues = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(textValues);
  if (value && typeof value === 'object') return Object.values(value).flatMap(textValues);
  return [];
};

test('indexable guide and section copy omits internal capture and evidence-boundary phrases', () => {
  const indexableCopy = textValues([
    ...guides.filter((guide) => guide.indexable),
    ...siteSections.filter((section) => section.indexable),
    site,
  ]).join('\n');

  for (const phrase of forbiddenPhrases) {
    assert.doesNotMatch(indexableCopy, phrase);
  }
});

test('shared guide rendering omits the same internal phrases', async () => {
  const source = await readFile(new URL('../components/guides.tsx', import.meta.url), 'utf8');

  for (const phrase of forbiddenPhrases) {
    assert.doesNotMatch(source, phrase);
  }
});

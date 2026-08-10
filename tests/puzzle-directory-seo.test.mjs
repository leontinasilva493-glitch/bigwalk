import test from 'node:test';
import assert from 'node:assert/strict';
import * as content from '../lib/content.mjs';

test('the puzzle directory exposes its requested search title, H1, and collection item list', () => {
  assert.equal(
    content.site.puzzleDirectory?.title,
    'Big Walk Puzzle Guide: Hints, Locations & Solutions',
  );
  assert.equal(
    content.site.puzzleDirectory?.h1,
    'Big Walk Puzzles Guide by Landmark and Tower',
  );
  assert.equal(
    content.site.puzzleDirectory?.description,
    'Browse Big Walk hints and source-checked solutions by tower, item, or location. Original marked screenshots are added after local capture.',
  );
  assert.equal(typeof content.buildPuzzleDirectoryJsonLd, 'function');

  const puzzleGuides = content.guides.filter((guide) => guide.kind === 'puzzle');
  const jsonLd = content.buildPuzzleDirectoryJsonLd(puzzleGuides);

  assert.equal(jsonLd['@context'], 'https://schema.org');
  assert.equal(jsonLd['@type'], 'CollectionPage');
  assert.equal(jsonLd.url, 'https://bigwalkwalkthrough.com/puzzles');
  assert.equal(jsonLd.mainEntity['@type'], 'ItemList');
  assert.equal(jsonLd.mainEntity.numberOfItems, puzzleGuides.length);
  assert.deepEqual(
    jsonLd.mainEntity.itemListElement,
    puzzleGuides.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: guide.h1,
      item: `https://bigwalkwalkthrough.com/${guide.slug}`,
    })),
  );
});

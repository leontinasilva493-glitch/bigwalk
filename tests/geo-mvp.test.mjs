import test from 'node:test';
import assert from 'node:assert/strict';
import { guideBySlug, guides, siteSections } from '../lib/content.mjs';
import { buildSitemapEntries } from '../lib/sitemap-content.mjs';
import { currentVersion, updates } from '../lib/updates-content.mjs';

async function optionalImport(path) {
  try {
    return await import(path);
  } catch (error) {
    if (error?.code === 'ERR_MODULE_NOT_FOUND') return undefined;
    throw error;
  }
}

test('the quick GEO MVP exposes the current official patch without inventing a release date', () => {
  assert.equal(currentVersion.version, '1.5.0');
  assert.equal(currentVersion.checkedAt, '2026-08-26');
  assert.equal(currentVersion.pagePublishedAt, '2026-08-25');
  assert.match(currentVersion.directAnswer, /does not publish a release date/i);
  assert.match(currentVersion.faqUrl, /bigwalk\.game\/faq/);

  const latest = updates[0];
  assert.equal(latest.version, '1.5.0');
  assert.equal(latest.releaseDate, null);
  assert.deepEqual(latest.changes, ['Fixes one patch of trees that was missing collision.']);

  const patchNotesEntry = buildSitemapEntries({ guides, siteSections })
    .find((entry) => entry.path === '/patch-notes');
  assert.equal(patchNotesEntry.lastModified, '2026-08-26');
});

test('the two route MVPs declare publication dates and answer-level source references', () => {
  const coordinates = guideBySlug('puzzles/4166-1899-coordinates');
  const train = guideBySlug('walkthrough/blue-tower-train');

  assert.equal(coordinates.datePublished, '2026-08-08');
  assert.deepEqual(coordinates.answerSourceUrls, [
    'https://www.pcgamer.com/games/puzzle/big-walk-number-puzzle-4166-1899/',
    'https://www.youtube.com/watch?v=-oTJVxglRn4',
  ]);
  assert.equal(train.datePublished, '2026-08-10');
  assert.deepEqual(train.answerSourceUrls, [
    'https://questdaily.com.au/walkthrough/guide-how-to-unlock-the-train-in-big-walk/',
    'https://insider-gaming.com/big-walk-unlock-train-big-ride-achievement/',
  ]);
});

test('answer evidence resolves declared URLs to real source records in order', async () => {
  const module = await optionalImport('../lib/answer-evidence.mjs');
  assert.ok(module, 'answer-evidence module should exist');

  const evidence = module.answerEvidenceFor(guideBySlug('puzzles/4166-1899-coordinates'));
  assert.equal(evidence.checkedAt, '2026-08-10');
  assert.deepEqual(evidence.sources.map((source) => source.publisher), ['PC Gamer', 'MonkeyKingHero']);
});

test('Article JSON-LD identifies the site as author and publisher with honest dates', async () => {
  const module = await optionalImport('../lib/article-json-ld.mjs');
  assert.ok(module, 'article-json-ld module should exist');

  const article = module.buildArticleJsonLd({
    site: { name: 'Big Walk Walkthrough', url: 'https://bigwalkwalkthrough.com' },
    headline: 'How to Solve 4166, 1899 in Big Walk',
    description: 'A source-checked coordinate route.',
    datePublished: '2026-08-08',
    dateModified: '2026-08-25',
    url: 'https://bigwalkwalkthrough.com/puzzles/4166-1899-coordinates',
  });

  assert.equal(article['@type'], 'Article');
  assert.equal(article.datePublished, '2026-08-08');
  assert.equal(article.dateModified, '2026-08-25');
  assert.deepEqual(article.author, {
    '@type': 'Organization',
    name: 'Big Walk Walkthrough',
    url: 'https://bigwalkwalkthrough.com',
  });
  assert.deepEqual(article.publisher, article.author);
  assert.equal('image' in article, false);
});

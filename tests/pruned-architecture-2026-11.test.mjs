import test from 'node:test';
import assert from 'node:assert/strict';
import { guides, siteSections } from '../lib/content.mjs';
import { prunedRedirects } from '../lib/pruned-redirects.mjs';
import { buildSitemapEntries } from '../lib/sitemap-content.mjs';
import nextConfig from '../next.config.mjs';

test('all 18 pruned draft and low-demand routes return 301 to live indexable destinations without chains', async () => {
  const configuredRedirects = await nextConfig.redirects();
  assert.deepEqual(configuredRedirects, prunedRedirects);

  const sitemapPaths = new Set(buildSitemapEntries({ guides, siteSections }).map((entry) => entry.path));
  const redirectSources = new Set(prunedRedirects.map((rule) => rule.source));

  for (const rule of prunedRedirects) {
    assert.equal(rule.statusCode, 301, `${rule.source} must use HTTP 301`);
    assert.equal('permanent' in rule, false, `${rule.source} must not mix statusCode and permanent`);
    assert.ok(sitemapPaths.has(rule.destination), `${rule.destination} must be a live indexable sitemap destination`);
    assert.ok(!redirectSources.has(rule.destination), `${rule.destination} must not chain into another redirect`);
  }

  for (const requiredSource of [
    '/troubleshooting',
    '/troubleshooting/:slug+',
    '/multiplayer/how-to-find-players',
    '/multiplayer/best-group-size',
    '/multiplayer/drop-in-host-save',
    '/multiplayer/hosting-and-saves',
    '/multiplayer/transfer-save-to-new-host',
    '/beginner-guide/can-you-play-solo',
    '/beginner-guide/lost-items-and-lost-found',
    '/puzzles/purple-things-where-to-use',
    '/walkthrough/green-room',
    '/methodology',
    '/patch-notes',
  ]) {
    assert.ok(redirectSources.has(requiredSource), `missing 301 rule for ${requiredSource}`);
  }
});

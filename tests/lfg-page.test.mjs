import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { beginnerGuideContent } from '../lib/beginner-guide-content.mjs';
import { siteSectionBySlug } from '../lib/content.mjs';

const root = new URL('../', import.meta.url);

test('LFG directory publishes the approved search intent and index state', () => {
  const page = siteSectionBySlug('multiplayer/how-to-find-players');

  assert.equal(page.title, 'Big Walk LFG: How to Find Players & Join a Group');
  assert.equal(page.h1, 'How to Find Big Walk Players (LFG Guide)');
  assert.equal(
    page.description,
    'No public matchmaking in Big Walk? Find teammates via the current Reddit LFG thread and Steam discussions, then share version, host, and session details safely.',
  );
  assert.equal(page.verificationLabel, 'Reddit and Steam sources linked');
  assert.equal(page.status, 'published');
  assert.equal(page.evidenceLevel, 'corroborated');
  assert.equal(page.indexable, true);
  assert.equal(page.updated, '2026-08-25');
  assert.deepEqual(page.relatedSlugs, [
    'multiplayer',
    'multiplayer/best-group-size',
    'multiplayer/hosting-and-saves',
  ]);
});

test('LFG page renders current source-checked channels before the posting and safety guidance', async () => {
  const source = await readFile(new URL('app/multiplayer/how-to-find-players/page.tsx', root), 'utf8');

  const channels = source.indexOf('Active LFG channels');
  const template = source.indexOf('Safe posting template');
  const safety = source.indexOf('Safety notes');
  const related = source.indexOf('Related pages');

  assert.ok(channels >= 0, 'active channel section is rendered');
  assert.ok(template > channels, 'posting template follows the channels');
  assert.ok(safety > template, 'safety guidance follows the template');
  assert.ok(related > safety, 'related journeys finish the page');
  assert.match(source, /Looking for Group Megathread \(23 August 2026\)/);
  assert.match(source, /steamcommunity\.com\/app\/1478500\/discussions/);
  assert.doesNotMatch(source, /discord\.com\/invite/);
  assert.match(source, /public Discord|invite scam|untrusted invite/i);
  assert.match(source, /Platform.*Region.*Language.*Age range.*Mic preference.*Current progress.*Goal.*Game version.*Host preference/s);
  assert.match(source, /do not post your exact age/i);
  assert.match(source, /Join Code.*private/i);
  assert.match(source, /harassment/i);
  assert.match(source, /spoiler/i);
});

test('player-finding journey links from the beginner guide and every puzzle detail', async () => {
  const guideComponents = await readFile(new URL('components/guides.tsx', root), 'utf8');

  assert.ok(
    beginnerGuideContent.relatedLinks.some((link) => link.href === '/multiplayer/how-to-find-players'),
    'beginner guide should send new players to the LFG directory',
  );
  assert.match(
    guideComponents,
    /guide\.kind === 'puzzle'[\s\S]*href: '\/puzzles#visual-finder'/,
    'the shared puzzle detail footer should lead back to the visual finder',
  );
});

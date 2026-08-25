import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guideBySlug, guides, siteSectionBySlug } from '../lib/content.mjs';

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

test('patch notes owns current update intent with official version history', async () => {
  const [updates, page] = await Promise.all([
    optionalImport('../lib/updates-content.mjs'),
    sourceFor('app/patch-notes/page.tsx'),
  ]);

  assert.ok(updates, 'updates content module should exist');
  assert.equal(updates.currentVersion.version, '1.4.10');
  assert.equal(updates.currentVersion.checkedAt, '2026-08-25');
  assert.match(updates.currentVersion.officialUrl, /bigwalk\.game\/history/);
  assert.deepEqual(updates.updates.map((entry) => entry.version), ['1.4.10', '1.4.9', '1.4.8', '1.4.7']);
  assert.match(page, /canonical:\s*'\/patch-notes'/);
  assert.match(page, /robots:\s*\{\s*index:\s*true/);
  assert.match(page, /Big Walk Patch Notes/);
  assert.match(page, /Only the first two version numbers need to match/);
});
test('Black Tower and colored pegboard are separate publishable guide records', () => {
  const blackTower = guideBySlug('walkthrough/black-tower');
  const coloredPegboard = guideBySlug('puzzles/colored-pegboard');
  const forgetMeNot = guideBySlug('puzzles/peg-puzzle');

  assert.equal(guides.length, 14);
  for (const guide of [blackTower, coloredPegboard]) {
    assert.ok(guide);
    assert.equal(guide.verificationStatus, 'source_checked');
    assert.equal(guide.status, 'published');
    assert.equal(guide.indexable, true);
    assert.equal(guide.gameVersion, '1.4.10');
    assert.ok(guide.sources.length >= 3);
    assert.ok(guide.solutionSteps.length >= 5);
    assert.ok(guide.commonFailures.length >= 4);
  }

  assert.ok(coloredPegboard.aliases.includes('big walk peg puzzle'));
  assert.ok(!forgetMeNot.aliases.includes('big walk peg puzzle'));
  assert.match(blackTower.directAnswer, /vision/i);
  assert.match(blackTower.directAnswer, /Wall/);
  assert.match(coloredPegboard.directAnswer, /36/);
  assert.match(coloredPegboard.evidenceNote, /placement/i);
});

test('purple rewards and White Key have one clear completion route', () => {
  const purple = siteSectionBySlug('puzzles/purple-challenges');
  const ending = guideBySlug('walkthrough/true-ending');

  assert.equal(purple.indexable, true);
  assert.match(purple.quickAnswer, /seven/i);
  assert.match(purple.quickAnswer, /15/);
  assert.equal(purple.completionSteps.length, 5);
  assert.match(purple.rewardUse, /White Key/);

  assert.equal(ending.verificationStatus, 'source_checked');
  assert.equal(ending.status, 'published');
  assert.equal(ending.indexable, true);
  assert.equal(ending.gameVersion, '1.4.10');
  assert.match(ending.directAnswer, /8 red/i);
  assert.match(ending.directAnswer, /7 purple/i);
  assert.match(ending.directAnswer, /White Key/);
  assert.match(ending.evidenceNote, /same host save/i);
});

test('achievements is a Platinum roadmap rather than only a trophy list', async () => {
  const page = await sourceFor('app/achievements/page.tsx');

  assert.match(page, /Platinum roadmap/i);
  assert.match(page, /Phase 1/);
  assert.match(page, /Phase 4/);
  assert.match(page, /12 Steam achievements/);
  assert.match(page, /13 PS5 trophies/);
  assert.match(page, /same host save/i);
  assert.match(page, /Version 1\.4\.10/);
});

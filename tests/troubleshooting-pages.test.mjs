import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { troubleshootingBySlug, troubleshootingGuides } from '../lib/troubleshooting-content.mjs';

const expectedSlugs = [
  'cant-rejoin-after-disconnect',
  'voice-chat-not-working',
  'white-screen-and-crash',
];

test('the three priority troubleshooting pages contain symptom-first diagnostic records', () => {
  assert.deepEqual(troubleshootingGuides.map((guide) => guide.slug), expectedSlugs);

  for (const slug of expectedSlugs) {
    const guide = troubleshootingBySlug(slug);
    assert.ok(guide);
    assert.equal(guide.indexable, false);
    assert.ok(guide.quickChecks.length >= 3);
    assert.ok(guide.diagnosticSteps.length >= 3);
    assert.ok(guide.sources.length >= 2);
    assert.ok(guide.evidenceNeeds.length >= 2);
  }
});

test('voice and startup guidance preserves product behavior and community evidence boundaries', () => {
  const voice = troubleshootingBySlug('voice-chat-not-working');
  const startup = troubleshootingBySlug('white-screen-and-crash');
  const voiceText = JSON.stringify(voice);
  const startupText = JSON.stringify(startup);

  assert.match(voiceText, /distance|proximity/i);
  assert.match(voiceText, /quiet microphone/i);
  assert.match(startupText, /community-reported|community report/i);
  assert.match(startupText, /not a confirmed fix/i);
});

test('priority routes render the dedicated troubleshooting template and hub symptom router', async () => {
  const routes = await Promise.all(expectedSlugs.map((slug) =>
    readFile(new URL(`../app/troubleshooting/${slug}/page.tsx`, import.meta.url), 'utf8')));
  const hub = await readFile(new URL('../app/troubleshooting/page.tsx', import.meta.url), 'utf8');

  for (const source of routes) {
    assert.match(source, /TroubleshootingGuide/);
    assert.match(source, /troubleshootingMetadata/);
  }
  assert.match(hub, /TroubleshootingHub/);
});

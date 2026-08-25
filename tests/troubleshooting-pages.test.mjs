import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { troubleshootingBySlug, troubleshootingGuides } from '../lib/troubleshooting-content.mjs';

const expectedSlugs = [
  'cant-rejoin-after-disconnect',
  'voice-chat-not-working',
  'white-screen-and-crash',
  'save-corrupted-or-missing',
];

test('the four priority troubleshooting pages contain symptom-first diagnostic records', () => {
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

test('rejoin guidance keeps official clock checks separate from mixed community outcomes', () => {
  const reconnect = troubleshootingBySlug('cant-rejoin-after-disconnect');
  const officialStep = reconnect.diagnosticSteps.find((step) => step.evidence === 'Official');
  const clockStep = reconnect.diagnosticSteps.find((step) => /clock/i.test(step.title));

  assert.match(JSON.stringify(reconnect), /1\.4\.10/);
  assert.match(JSON.stringify(reconnect), /exact error|error text/i);
  assert.ok(officialStep, 'at least one diagnostic step is directly supported by the official version history');
  assert.equal(clockStep?.evidence, 'Official');
  assert.match(clockStep?.reason ?? '', /prevent.*join|host/i);
  assert.match(JSON.stringify(reconnect.sources), /mixed results/i);
});

test('crash and save recovery guidance separate high-risk symptoms and preserve the original save', () => {
  const startup = troubleshootingBySlug('white-screen-and-crash');
  const save = troubleshootingBySlug('save-corrupted-or-missing');

  assert.match(JSON.stringify(startup), /frame rate|hard lock|black screen/i);
  assert.match(JSON.stringify(startup), /Frame Rate Limit|Vsync/i);
  assert.equal(save.indexable, false);
  assert.match(save.summary, /backup|copy/i);
  assert.match(JSON.stringify(save), /Previous Versions/);
  assert.match(JSON.stringify(save), /not available|not guaranteed|may not/i);
  assert.doesNotMatch(JSON.stringify(save), /delete the original/i);
});

test('priority routes render the dedicated troubleshooting template and hub symptom router', async () => {
  const routes = await Promise.all(expectedSlugs.map((slug) =>
    readFile(new URL(`../app/troubleshooting/${slug}/page.tsx`, import.meta.url), 'utf8')));
  const hub = await readFile(new URL('../app/troubleshooting/page.tsx', import.meta.url), 'utf8');
  const template = await readFile(new URL('../components/troubleshooting-guide.tsx', import.meta.url), 'utf8');

  for (const source of routes) {
    assert.match(source, /TroubleshootingGuide/);
    assert.match(source, /troubleshootingMetadata/);
  }
  assert.match(hub, /TroubleshootingHub/);
  assert.match(template, /route-recovery__mobile-list/);
  assert.match(template, /step\.evidence/);
  assert.match(template, /step\.action/);
  assert.match(template, /step\.reason/);
});

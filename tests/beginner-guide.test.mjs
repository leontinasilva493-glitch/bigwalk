import test from 'node:test';
import assert from 'node:assert/strict';
import { siteSectionBySlug } from '../lib/content.mjs';

function textValues(value, excludedKeys = new Set()) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap((item) => textValues(item, excludedKeys));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => (
      excludedKeys.has(key) ? [] : textValues(item, excludedKeys)
    ));
  }
  return [];
}

test('beginner guide is a publishable spoiler-light first-session handbook', () => {
  const page = siteSectionBySlug('beginner-guide');

  assert.equal(page.indexable, true);
  assert.equal(page.status, 'published');
  assert.equal(page.evidenceLevel, 'corroborated');
  assert.equal(page.title, 'Big Walk Beginner Guide — First Session Tips, Saves & Co-op Setup');
  assert.equal(page.h1, 'Big Walk Beginner Guide: What to Know Before Your First Walk');
  assert.equal(page.updated, '2026-08-10');
  assert.match(page.description, /spoiler-light/i);
});

test('beginner guide covers the complete first-session journey without becoming a puzzle walkthrough', () => {
  const page = siteSectionBySlug('beginner-guide');
  const content = page.beginnerGuide;

  assert.equal(content.quickStart.length, 5);
  assert.equal(content.worldSizes.length, 3);
  assert.ok(content.firstTenMinutes.length >= 6);
  assert.ok(content.communication.length >= 4);
  assert.ok(content.separation.steps.length >= 4);
  assert.ok(content.carryFirst.length >= 3);
  assert.ok(content.firstRoute.steps.length >= 3);
  assert.ok(content.mistakes.length >= 6);
  assert.ok(content.faqs.length >= 6);
  assert.ok(content.relatedLinks.length >= 6);

  const text = textValues(content).join(' ');
  assert.match(text, /host/i);
  assert.match(text, /Join Code/i);
  assert.match(text, /autosave/i);
  assert.match(text, /proximity/i);
  assert.match(text, /regroup/i);
  assert.match(text, /Crosswalk/i);
  assert.doesNotMatch(text, /2[–-]3 metres|nine bags|only one puzzle|12[–-]15 hours|walk backwards/i);
});

test('beginner guide pairs one official embed with labelled community video references', () => {
  const page = siteSectionBySlug('beginner-guide');
  const content = page.beginnerGuide;

  assert.deepEqual(content.officialVideo, {
    id: 'G0ez7AP4-GM',
    title: 'Official Big Walk Gameplay Overview',
    duration: '3:50',
    watchUrl: 'https://www.youtube.com/watch?v=G0ez7AP4-GM',
  });
  assert.ok(content.communityVideos.length >= 2);
  assert.ok(content.communityVideos.every((video) => (
    video.url.startsWith('https://www.youtube.com/watch?v=')
    && video.status === 'Community-reported'
    && video.note
  )));
});

test('beginner guide keeps official facts and community tactics visibly separated', () => {
  const page = siteSectionBySlug('beginner-guide');
  const content = page.beginnerGuide;
  const statuses = new Set(textValues(content).filter((value) => (
    ['Official-confirmed', 'Source-checked', 'Community-reported', 'To verify'].includes(value)
  )));

  assert.deepEqual([...statuses].sort(), [
    'Community-reported',
    'Official-confirmed',
    'Source-checked',
    'To verify',
  ]);
  assert.ok(content.sources.length >= 6);
  assert.ok(content.sources.some((source) => source.publisher === 'House House'));
  assert.ok(content.sources.some((source) => source.publisher === 'r/BigWalk'));
});

test('beginner guide contains a substantial 1400 to 1800 word English handbook', () => {
  const page = siteSectionBySlug('beginner-guide');
  const technicalFields = new Set(['duration', 'href', 'id', 'status', 'url', 'watchUrl']);
  const bodyText = textValues(page.beginnerGuide, technicalFields).join(' ');
  const wordCount = bodyText.match(/[A-Za-z0-9][A-Za-z0-9’'+-]*/g)?.length ?? 0;

  assert.ok(wordCount >= 1400, `expected at least 1400 words, received ${wordCount}`);
  assert.ok(wordCount <= 1800, `expected no more than 1800 words, received ${wordCount}`);
});

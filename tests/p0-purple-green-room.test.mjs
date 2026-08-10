import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guideBySlug, siteSectionBySlug } from '../lib/content.mjs';

test('purple challenges is an indexable seven-challenge directory with evidence-gated facts', () => {
  const page = siteSectionBySlug('puzzles/purple-challenges');

  assert.equal(page.indexable, true);
  assert.equal(page.status, 'published');
  assert.equal(page.title, 'Purple Challenges in Big Walk — All 7 Listed with Locations');
  assert.equal(page.updated, '2026-08-10');
  assert.equal(page.challenges.length, 7);
  assert.ok(page.challenges.every((challenge) => (
    challenge.name
    && challenge.visualCues
    && challenge.position
    && challenge.prerequisiteItem
    && challenge.transport
    && challenge.playerCount
    && challenge.verificationStatus
  )));
  assert.ok(page.challenges.filter((challenge) => challenge.position !== 'Position TBD').length >= 3);
  assert.deepEqual(
    page.pendingFirstHand.map((fact) => fact.label),
    ['Total', 'Rewards', 'Player-count differences'],
  );
  assert.ok(page.pendingFirstHand.every((fact) => fact.value === 'Pending first-hand verification'));
});

test('purple challenges keeps the shared evidence skeleton and enters generated sitemap discovery', async () => {
  const [component, sitemap] = await Promise.all([
    readFile(new URL('../components/evidence-page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8'),
  ]);

  assert.match(component, /challenge-directory/);
  assert.match(component, /page\.challenges/);
  assert.match(component, /page\.indexable/);
  assert.match(component, /page\.updated/);
  assert.match(sitemap, /siteSections\s*\.filter\(\(section\)\s*=>\s*section\.indexable\)/);
});

test('green room is a complete noindex research route with disambiguation and conflict labels', () => {
  const guide = guideBySlug('walkthrough/green-room');

  assert.ok(guide);
  assert.equal(guide.title, 'Big Walk Green Room Location & How to Open It');
  assert.equal(guide.h1, 'How to Find and Open the Green Room in Big Walk');
  assert.equal(guide.indexable, false);
  assert.equal(guide.verificationStatus, 'evidence_conflict');
  assert.match(guide.description, /^This is NOT the green chair and headphones \(Sound Check\) puzzle/);
  assert.equal(guide.greenRoomSections.routes.length, 2);
  assert.match(guide.greenRoomSections.entrance.body, /position to be verified/i);
  assert.equal(guide.greenRoomSections.slots.status, 'Community-reported');
  assert.equal(guide.greenRoomSections.itemConflict.status, 'Evidence conflict');
  assert.equal(guide.greenRoomSections.itemConflict.sources.length, 2);
  assert.deepEqual(guide.plannedLinks, [
    'puzzles/purple-things-where-to-use',
    'puzzles/purple-challenges',
    'walkthrough/true-ending',
  ]);
});

test('green room renders its ordered research sections and remains outside the sitemap', async () => {
  const [route, components, sitemap] = await Promise.all([
    readFile(new URL('../app/walkthrough/[...slug]/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../components/guides.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8'),
  ]);

  assert.match(route, /GreenRoomResearch/);
  assert.ok(route.indexOf('<GreenRoomResearch') < route.indexOf('<RouteOverview'));
  assert.match(components, /sections\.slots/);
  assert.match(components, /sections\.itemConflict/);
  assert.doesNotMatch(sitemap, /walkthrough\/green-room/);
});

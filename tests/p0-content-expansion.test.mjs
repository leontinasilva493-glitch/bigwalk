import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function optionalImport(path) {
  try {
    return await import(path);
  } catch (error) {
    if (error?.code === 'ERR_MODULE_NOT_FOUND') return undefined;
    throw error;
  }
}

async function optionalSource(path) {
  try {
    return await readFile(new URL(path, import.meta.url), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return '';
    throw error;
  }
}

test('lost items guide routes players by item state without promising one universal reset location', async () => {
  const [content, catalogue, page] = await Promise.all([
    optionalImport('../lib/lost-items-content.mjs'),
    import('../lib/content.mjs'),
    optionalSource('../app/beginner-guide/lost-items-and-lost-found/page.tsx'),
  ]);

  assert.ok(content, 'lost-items content module should exist');
  const guide = content.lostItemsGuide;
  assert.equal(guide.slug, 'beginner-guide/lost-items-and-lost-found');
  assert.equal(guide.indexable, false);
  assert.equal(guide.status, 'research');
  assert.equal(guide.gameVersion, '1.5.0');
  assert.equal(guide.sourceCheckedAt, '2026-08-28');
  assert.ok(guide.scenarios.length >= 4);
  assert.ok(guide.recoverySteps.length >= 5);
  assert.ok(guide.sources.length >= 4);
  assert.match(JSON.stringify(guide), /original puzzle|source puzzle/i);
  assert.match(JSON.stringify(guide), /Lost\s*&\s*Found/i);
  assert.match(JSON.stringify(guide), /Map Room/i);
  assert.match(JSON.stringify(guide), /conflict|not officially documented|player report/i);
  assert.doesNotMatch(guide.quickAnswer, /always|guaranteed/i);

  const section = catalogue.siteSectionBySlug(guide.slug);
  assert.ok(section, 'lost-items route should be represented in the site catalogue');
  assert.equal(section.indexable, false);
  assert.match(JSON.stringify(catalogue.siteSectionBySlug('beginner-guide').beginnerGuide.relatedLinks), /lost-items-and-lost-found/);

  assert.match(page, /robots:\s*\{\s*index:\s*false/);
  assert.match(page, /What kind of item is missing\?/);
  assert.match(page, /Safe recovery order/);
  assert.match(page, /Sources and evidence limits/);
  assert.match(page, /href="\/multiplayer\/hosting-and-saves"/);
  assert.match(page, /href="\/map"/);
  assert.match(page, /href="\/puzzles"/);
});

test('hosting and saves guide separates official session rules from item persistence reports', async () => {
  const [content, catalogue, page] = await Promise.all([
    optionalImport('../lib/hosting-saves-content.mjs'),
    import('../lib/content.mjs'),
    optionalSource('../app/multiplayer/hosting-and-saves/page.tsx'),
  ]);

  assert.ok(content, 'hosting-and-saves content module should exist');
  const guide = content.hostingSavesGuide;
  assert.equal(guide.slug, 'multiplayer/hosting-and-saves');
  assert.equal(guide.indexable, false);
  assert.equal(guide.status, 'research');
  assert.equal(guide.gameVersion, '1.5.0');
  assert.equal(guide.sourceCheckedAt, '2026-08-28');
  assert.ok(guide.officialRules.length >= 6);
  assert.ok(guide.sessionSteps.length >= 5);
  assert.ok(guide.persistenceRows.length >= 5);
  assert.ok(guide.sources.length >= 4);
  assert.match(JSON.stringify(guide.officialRules), /host.*save|save.*host/i);
  assert.match(JSON.stringify(guide.officialRules), /password/i);
  assert.match(JSON.stringify(guide.officialRules), /first two.*version|version.*first two/i);
  assert.match(JSON.stringify(guide.persistenceRows), /player report|community/i);
  assert.match(JSON.stringify(guide), /no official.*transfer|not document.*transfer/i);

  const section = catalogue.siteSectionBySlug(guide.slug);
  assert.equal(section.indexable, false);
  assert.equal(section.status, 'research');
  assert.equal(section.updated, '2026-08-28');
  assert.equal(section.hostingSaves, guide);
  assert.doesNotMatch(JSON.stringify(catalogue.siteSectionBySlug('beginner-guide').beginnerGuide.hosting), /use the save-transfer guide/i);

  assert.match(page, /robots:\s*\{\s*index:\s*false/);
  assert.match(page, /Who owns the save\?/);
  assert.match(page, /Before starting a session/);
  assert.match(page, /What persists between sessions\?/);
  assert.match(page, /Sources and unresolved limits/);
  assert.match(page, /href="\/beginner-guide\/lost-items-and-lost-found"/);
  assert.match(page, /href="\/troubleshooting\/cant-connect-or-join"/);
});

test('connection guide owns broad join failures and preserves the old rejoin URL as a permanent redirect', async () => {
  const [content, catalogue, page, legacy] = await Promise.all([
    import('../lib/troubleshooting-content.mjs'),
    import('../lib/content.mjs'),
    optionalSource('../app/troubleshooting/cant-connect-or-join/page.tsx'),
    optionalSource('../app/troubleshooting/cant-rejoin-after-disconnect/page.tsx'),
  ]);

  const guide = content.troubleshootingBySlug('cant-connect-or-join');
  assert.ok(guide);
  assert.equal(content.troubleshootingBySlug('cant-rejoin-after-disconnect'), undefined);
  assert.equal(guide.indexable, false);
  assert.equal(guide.gameVersion, '1.5.0');
  assert.equal(guide.sourceCheckedAt, '2026-08-28');
  assert.match(guide.title, /Can(?:not|'t) Connect or Join/i);
  assert.ok(guide.symptomRows.length >= 5);
  assert.ok(guide.diagnosticSteps.length >= 7);
  assert.match(JSON.stringify(guide), /friends.*list|friend.*game/i);
  assert.match(JSON.stringify(guide), /Epic Online Services|EOS/);
  assert.match(JSON.stringify(guide), /system clock/i);
  assert.match(JSON.stringify(guide), /first two.*version|version.*first two/i);
  assert.match(JSON.stringify(guide), /proxy/i);

  assert.ok(catalogue.siteSectionBySlug('troubleshooting/cant-connect-or-join'));
  assert.equal(catalogue.siteSectionBySlug('troubleshooting/cant-rejoin-after-disconnect'), undefined);
  assert.match(page, /TroubleshootingGuide/);
  assert.match(legacy, /permanentRedirect\('\/troubleshooting\/cant-connect-or-join'\)/);
});

test('voice guide distinguishes intentional proximity from platform-specific failures', async () => {
  const [content, page, template] = await Promise.all([
    import('../lib/troubleshooting-content.mjs'),
    optionalSource('../app/troubleshooting/voice-chat-not-working/page.tsx'),
    optionalSource('../components/troubleshooting-guide.tsx'),
  ]);

  const guide = content.troubleshootingBySlug('voice-chat-not-working');
  assert.equal(guide.indexable, false);
  assert.equal(guide.gameVersion, '1.5.0');
  assert.equal(guide.sourceCheckedAt, '2026-08-28');
  assert.ok(guide.symptomRows.length >= 5);
  assert.ok(guide.platformChecks.length >= 4);
  assert.ok(guide.diagnosticSteps.length >= 7);
  assert.ok(guide.sources.length >= 4);
  assert.match(JSON.stringify(guide), /1\.4\.8/);
  assert.match(JSON.stringify(guide), /1\.4\.10/);
  assert.match(JSON.stringify(guide), /normal.*proximity|proximity.*expected/i);
  assert.match(JSON.stringify(guide), /Windows 11/);
  assert.match(JSON.stringify(guide), /PlayStation 5|PS5/);
  assert.match(JSON.stringify(guide), /macOS/);
  assert.match(page, /TroubleshootingGuide/);
  assert.match(template, /Platform-specific checks/);
  assert.match(template, /guide\.platformChecks/);
});

test('puzzle hub lets players choose spoiler depth and separates completion from reward delivery', async () => {
  const [content, catalogue, sitemap, page] = await Promise.all([
    import('../lib/gameplay-demand-content.mjs'),
    import('../lib/content.mjs'),
    import('../lib/sitemap-content.mjs'),
    optionalSource('../app/puzzles/page.tsx'),
  ]);

  assert.ok(content.puzzleHelpLevels);
  assert.ok(content.mapRoomPuzzleStates);
  assert.deepEqual(content.puzzleHelpLevels.map((level) => level.label), ['Hint', 'Nudge', 'Full solution']);
  assert.equal(content.mapRoomPuzzleStates.length, 3);
  assert.match(JSON.stringify(content.mapRoomPuzzleStates), /unfinished/i);
  assert.match(JSON.stringify(content.mapRoomPuzzleStates), /solved.*not.*delivered|not.*delivered.*solved/i);
  assert.match(JSON.stringify(content.mapRoomPuzzleStates), /completed.*delivered|delivered.*completed/i);
  assert.match(JSON.stringify(content.mapRoomPuzzleStates), /player.report|community/i);

  assert.match(page, /Choose how much help to reveal/);
  assert.match(page, /puzzleHelpLevels\.map/);
  assert.match(page, /Read the Map Room state/);
  assert.match(page, /mapRoomPuzzleStates\.map/);
  assert.match(page, /2-player, 3-player, or 4\+/);
  assert.match(page, /href="\/beginner-guide\/lost-items-and-lost-found"/);

  const puzzleEntry = sitemap.buildSitemapEntries({ guides: catalogue.guides, siteSections: catalogue.siteSections })
    .find((entry) => entry.path === '/puzzles');
  assert.equal(puzzleEntry.lastModified, '2026-08-28');
});

test('true ending guide answers safe continuation and exposes a same-host 100 percent checklist', async () => {
  const [catalogue, sitemap, route, components] = await Promise.all([
    import('../lib/content.mjs'),
    import('../lib/sitemap-content.mjs'),
    optionalSource('../app/walkthrough/[...slug]/page.tsx'),
    optionalSource('../components/guides.tsx'),
  ]);

  const guide = catalogue.guideBySlug('walkthrough/true-ending');
  assert.equal(guide.gameVersion, '1.5.0');
  assert.equal(guide.sourceCheckedAt, '2026-08-28');
  assert.equal(guide.updated, '2026-08-28');
  assert.match(guide.routeNotice.heading, /keep playing|continue/i);
  assert.match(guide.routeNotice.answer, /same host save/i);
  assert.match(guide.routeNotice.answer, /official.*does not|not.*official|community|completion sources/i);
  assert.equal(guide.completionChecklist.length, 7);
  assert.match(JSON.stringify(guide.completionChecklist), /Big Goodbye/);
  assert.match(JSON.stringify(guide.completionChecklist), /8 red/);
  assert.match(JSON.stringify(guide.completionChecklist), /7 purple/);
  assert.match(JSON.stringify(guide.completionChecklist), /White Key/);
  assert.match(JSON.stringify(guide.completionChecklist), /Big Game/);
  assert.match(JSON.stringify(guide.sources), /100 percented|100%|YouTube/i);

  assert.match(components, /export function CompletionChecklist/);
  assert.match(components, /guide\.completionChecklist/);
  assert.match(components, /completion-checklist-heading/);
  assert.match(route, /<CompletionChecklist guide=\{guide\}/);
  assert.ok(route.indexOf('<CompletionChecklist') < route.indexOf('<HintBlock'));

  const endingEntry = sitemap.buildSitemapEntries({ guides: catalogue.guides, siteSections: catalogue.siteSections })
    .find((entry) => entry.path === '/walkthrough/true-ending');
  assert.equal(endingEntry.lastModified, '2026-08-28');
});

test('LFG guide matches group fit before a private join-code handoff', async () => {
  const [content, catalogue, sitemap, page] = await Promise.all([
    optionalImport('../lib/lfg-content.mjs'),
    import('../lib/content.mjs'),
    import('../lib/sitemap-content.mjs'),
    optionalSource('../app/multiplayer/how-to-find-players/page.tsx'),
  ]);

  assert.ok(content, 'LFG content module should exist');
  const guide = content.lfgGuide;
  assert.equal(guide.slug, 'multiplayer/how-to-find-players');
  assert.equal(guide.gameVersion, '1.5.0');
  assert.equal(guide.lastChecked, '2026-08-28');
  assert.ok(guide.channels.length >= 2);
  assert.ok(guide.fitRows.length >= 7);
  assert.ok(guide.safeJoinSteps.length >= 5);
  assert.ok(guide.sources.length >= 3);
  assert.match(JSON.stringify(guide.channels), /Reddit/);
  assert.match(JSON.stringify(guide.channels), /Steam/);
  assert.match(JSON.stringify(guide.fitRows), /spoiler/i);
  assert.match(JSON.stringify(guide.fitRows), /host/i);
  assert.match(JSON.stringify(guide.safeJoinSteps), /private|direct message/i);
  assert.match(JSON.stringify(guide.safeJoinSteps), /password/i);
  assert.doesNotMatch(guide.postingExample, /Join Code:\s*\d{6}/i);

  assert.match(page, /Choose a compatible group/);
  assert.match(page, /Private join handoff/);
  assert.match(page, /lfgGuide\.fitRows/);
  assert.match(page, /lfgGuide\.safeJoinSteps/);

  const lfgEntry = sitemap.buildSitemapEntries({ guides: catalogue.guides, siteSections: catalogue.siteSections })
    .find((entry) => entry.path === '/multiplayer/how-to-find-players');
  assert.equal(lfgEntry.lastModified, '2026-08-28');
});

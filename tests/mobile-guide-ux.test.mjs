import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function sourceFor(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

function sliceBetween(source, startToken, endToken) {
  const start = source.indexOf(startToken);
  const end = endToken ? source.indexOf(endToken) : source.length;
  assert.ok(start >= 0, `Missing token: ${startToken}`);
  assert.ok(end > start, `Missing token after ${startToken}: ${endToken}`);
  return source.slice(start, end);
}

test('guide toc points only at live semantic sections', async () => {
  const source = await sourceFor('components/guides.tsx');
  const tocSource = sliceBetween(source, 'export function GuideToc', 'export function VerificationPanel');

  assert.match(tocSource, /href="#hint-heading"/);
  assert.match(tocSource, /const quickAnswerTarget/);
  assert.match(tocSource, /#quick-answer-heading/);
  assert.match(tocSource, /#route-overview-heading/);
  assert.match(tocSource, /href=\{quickAnswerTarget\}/);
  assert.match(tocSource, /href="#solution-heading"/);
  assert.match(tocSource, /href="#recovery-heading"/);
  assert.match(tocSource, /href="#sources-heading"/);
  assert.doesNotMatch(tocSource, /#before-you-start/);
  assert.doesNotMatch(tocSource, /#navigation-methods/);
  assert.doesNotMatch(tocSource, /#next-steps-heading/);
});

test('verification panel exposes stable solution recovery and source ids', async () => {
  const source = await sourceFor('components/guides.tsx');

  assert.match(source, /id="solution-heading"/);
  assert.match(source, /id="recovery-heading"/);
  assert.match(source, /id="sources-heading"/);
  assert.doesNotMatch(source, /recovery-\$\{guide\.slug/);
  assert.doesNotMatch(source, /sources-\$\{guide\.slug/);
});

test('recovery keeps the desktop table and adds mobile details cards', async () => {
  const source = await sourceFor('components/guides.tsx');

  assert.match(source, /className="route-recovery__table-wrap"/);
  assert.match(source, /className="route-recovery__mobile-list"/);
  assert.match(source, /className="route-recovery__mobile-card"/);
  assert.match(source, /<summary>\{failure\.problem\}<\/summary>/);
  assert.match(source, /<p>\{failure\.fix\}<\/p>/);
  assert.match(source, /<table>/);
});

test('both detail templates place the mobile toc immediately after the guide hero', async () => {
  for (const path of ['app/puzzles/[...slug]/page.tsx', 'app/walkthrough/[...slug]/page.tsx']) {
    const source = await sourceFor(path);
    const heroEnd = source.indexOf('</header>');
    const toc = source.indexOf('<GuideToc');
    const firstGuideSection = Math.min(
      ...['<CoordinatesFirstScreen', '<GreenRoomResearch', '<RouteOverview', '<HintBlock']
        .map((token) => source.indexOf(token))
        .filter((index) => index >= 0),
    );

    assert.ok(toc > heroEnd, `${path} puts the toc after the hero`);
    assert.ok(toc < firstGuideSection, `${path} puts the toc before guide content`);
  }
});

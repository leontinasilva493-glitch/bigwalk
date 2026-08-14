import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function sourceFor(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

function heroFor(source, path) {
  const heroStart = source.indexOf('<header id="guide-top" className="guide-hero">');
  const heroEnd = source.indexOf('</header>', heroStart);

  assert.ok(heroStart >= 0, `${path} has a guide hero`);
  assert.ok(heroEnd > heroStart, `${path} closes its guide hero`);
  return source.slice(heroStart, heroEnd);
}

test('video guides get a hero jump link that targets the semantic video section', async () => {
  const [guidesSource, ...routeSources] = await Promise.all([
    sourceFor('components/guides.tsx'),
    sourceFor('app/puzzles/[...slug]/page.tsx'),
    sourceFor('app/walkthrough/[...slug]/page.tsx'),
  ]);

  assert.match(guidesSource, /export function VideoJumpLink\(\{ href \}: \{ href: string \}\)/);
  assert.match(guidesSource, /<a className="video-jump-link" href=\{href\}>▶ Watch video ↓<\/a>/);
  assert.match(guidesSource, /const videoSectionId = `video-\$\{guide\.slug\.replaceAll\('\/', '-'\)\}`/);
  assert.match(guidesSource, /const videoHeadingId = `video-heading-\$\{guide\.slug\.replaceAll\('\/', '-'\)\}`/);
  assert.match(guidesSource, /<section id=\{videoSectionId\} className="guide-video" aria-labelledby=\{videoHeadingId\}>/);
  assert.match(guidesSource, /<h3 id=\{videoHeadingId\}>\{guide\.video\.title\}<\/h3>/);

  for (const [index, source] of routeSources.entries()) {
    const path = index === 0 ? 'puzzle' : 'walkthrough';
    const hero = heroFor(source, path);
    const metaIndex = hero.indexOf('guide-meta');
    const videoLinkIndex = hero.indexOf('<VideoJumpLink');

    assert.ok(metaIndex >= 0, `${path} hero renders guide meta`);
    assert.ok(videoLinkIndex > metaIndex, `${path} renders the video jump after its meta`);
    assert.match(hero, /\('video' in guide && guide\.video\) \? <VideoJumpLink href=\{`#video-\$\{guide\.slug\.replaceAll\('\/', '-'\)\}`\} \/> : null/);
  }
});

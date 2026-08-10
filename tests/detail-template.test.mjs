import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const detailRoutes = [
  '../app/puzzles/[...slug]/page.tsx',
  '../app/walkthrough/[...slug]/page.tsx',
];

test('detail templates are static server pages whose robots state follows each guide', async () => {
  for (const route of detailRoutes) {
    const source = await readFile(new URL(route, import.meta.url), 'utf8');

    assert.match(source, /generateStaticParams/);
    assert.match(source, /index:\s*guide\.indexable/);
    assert.match(source, /follow:\s*true/);
    assert.match(source, /Article/);
    assert.match(source, /BreadcrumbList/);

    const hintIndex = source.indexOf('HintBlock');
    const verificationIndex = source.indexOf('VerificationPanel');
    assert.ok(hintIndex >= 0, `${route} renders a spoiler-free HintBlock`);
    assert.ok(verificationIndex > hintIndex, `${route} puts the hint before verification`);
    assert.doesNotMatch(source, /\bfetch\s*\(/);
  }
});

test('walkthrough breadcrumbs omit the nonexistent walkthrough index', async () => {
  const [routeSource, guidesSource] = await Promise.all([
    readFile(new URL('../app/walkthrough/[...slug]/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../components/guides.tsx', import.meta.url), 'utf8'),
  ]);
  const breadcrumbComponent = guidesSource.match(
    /export function Breadcrumbs[\s\S]*?\n}\n\nexport function RelatedGuides/,
  )?.[0] ?? '';

  assert.match(routeSource, /position: 1, name: 'Home', item: site\.url/);
  assert.match(routeSource, /position: 2, name: guide\.h1, item: `\$\{site\.url\}\/\$\{guide\.slug\}`/);
  assert.doesNotMatch(routeSource, /name: 'Walkthrough'/);
  assert.doesNotMatch(routeSource, /position: 3/);

  assert.match(breadcrumbComponent, /<Link href="\/">Home<\/Link>/);
  assert.match(breadcrumbComponent, /<li aria-current="page">\{guide\.h1\}<\/li>/);
  assert.doesNotMatch(breadcrumbComponent, /Walkthrough/);
});

test('detail heroes show source status before catalogue copy', async () => {
  for (const route of detailRoutes) {
    const source = await readFile(new URL(route, import.meta.url), 'utf8');
    const statusIndex = source.indexOf('guide.verificationLabel');
    const kickerIndex = source.indexOf('guide-kicker');

    assert.ok(statusIndex >= 0, `${route} visibly states the guide evidence status`);
    assert.ok(statusIndex < kickerIndex, `${route} shows evidence status before the hero copy`);
  }
});

test('published guide pages render provenance, spoiler-gated steps, source links, and capture requests', async () => {
  const source = await readFile(new URL('../components/guides.tsx', import.meta.url), 'utf8');

  assert.match(source, /Source check/);
  assert.match(source, /solutionSteps/);
  assert.match(source, /Source links/);
  assert.match(source, /Original screenshot capture list/);
  assert.match(source, /youtube-nocookie\.com/);
});

test('walkthrough details activate the walkthrough destination in the shared header', async () => {
  const source = await readFile(new URL('../app/walkthrough/[...slug]/page.tsx', import.meta.url), 'utf8');

  assert.match(source, /<SiteHeader active="walkthrough" \/>/);
});

test('walkthrough routes show a direct route overview before optional spoilers', async () => {
  const [routeSource, guidesSource] = await Promise.all([
    readFile(new URL('../app/walkthrough/[...slug]/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../components/guides.tsx', import.meta.url), 'utf8'),
  ]);

  const overviewIndex = routeSource.indexOf('<RouteOverview');
  const hintIndex = routeSource.indexOf('<HintBlock');

  assert.ok(overviewIndex >= 0, 'the walkthrough template renders RouteOverview');
  assert.ok(overviewIndex < hintIndex, 'the direct route overview appears before the spoiler-free hint');
  assert.match(guidesSource, /Quick answer/);
  assert.match(guidesSource, /Route at a glance/);
});

test('published route guides render reusable failure recovery guidance', async () => {
  const source = await readFile(new URL('../components/guides.tsx', import.meta.url), 'utf8');

  assert.match(source, /If the route stalls/);
  assert.match(source, /<th>Problem<\/th>/);
  assert.match(source, /<th>What to do<\/th>/);
  assert.match(source, /failure\.problem/);
  assert.match(source, /failure\.fix/);
});

test('walkthrough video appears after the hint and before the full solution panel', async () => {
  const source = await readFile(new URL('../app/walkthrough/[...slug]/page.tsx', import.meta.url), 'utf8');

  const overviewIndex = source.indexOf('<RouteOverview');
  const hintIndex = source.indexOf('<HintBlock');
  const videoIndex = source.indexOf('<VideoEvidence');
  const solutionIndex = source.indexOf('<VerificationPanel');

  assert.ok(overviewIndex >= 0, 'route overview remains first');
  assert.ok(hintIndex > overviewIndex, 'spoiler-free hint follows the overview');
  assert.ok(videoIndex > hintIndex, 'video follows the spoiler-free hint');
  assert.ok(solutionIndex > videoIndex, 'full solution follows the video');
  assert.match(source, /<VerificationPanel guide=\{guide\} showVideo=\{false\}/);
});

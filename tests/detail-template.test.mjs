import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const detailRoutes = [
  '../app/puzzles/[...slug]/page.tsx',
  '../app/walkthrough/[...slug]/page.tsx',
];

test('detail templates are static, verification-gated server pages', async () => {
  for (const route of detailRoutes) {
    const source = await readFile(new URL(route, import.meta.url), 'utf8');

    assert.match(source, /generateStaticParams/);
    assert.match(source, /noindex/);
    assert.match(source, /follow/);
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

test('detail heroes show verification status before catalogue copy', async () => {
  for (const route of detailRoutes) {
    const source = await readFile(new URL(route, import.meta.url), 'utf8');
    const statusIndex = source.indexOf('Verification in progress');
    const kickerIndex = source.indexOf('guide-kicker');

    assert.ok(statusIndex >= 0, `${route} visibly states that verification is in progress`);
    assert.ok(statusIndex < kickerIndex, `${route} shows verification status before the hero copy`);
  }
});

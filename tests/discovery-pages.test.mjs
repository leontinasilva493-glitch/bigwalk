import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  guides,
  homepageDirectoryStats,
  homepageFeaturedGuideSlugs,
} from '../lib/content.mjs';

const pageFiles = {
  home: '../app/page.tsx',
  puzzles: '../app/puzzles/page.tsx',
  achievements: '../app/achievements/page.tsx',
  multiplayer: '../app/multiplayer/page.tsx',
  styles: '../app/globals.css',
  sitemap: '../app/sitemap.ts',
  robots: '../app/robots.ts',
};

async function sourceFor(name) {
  return readFile(new URL(pageFiles[name], import.meta.url), 'utf8');
}

test('indexable discovery pages distinguish source-checked solutions from unresolved reports and expose the directory structure', async () => {
  const [home, puzzles] = await Promise.all([sourceFor('home'), sourceFor('puzzles')]);

  for (const source of [home, puzzles]) {
    assert.doesNotMatch(source, /All Puzzles Solved/);
    assert.doesNotMatch(source, /Every Puzzle Solved/);
    assert.doesNotMatch(source, /Every Big Walk puzzle solved/);
  }

  assert.match(home, /Source-checked solutions/i);
  assert.match(home, /original marked screenshots are added after local capture/i);
  assert.match(home, /Need a solution\?/);
  assert.match(home, /Need the next unlock\?/);
  assert.match(home, /How to use this Big Walk directory/);
  assert.match(home, /href="\/methodology"/);
  assert.match(home, /CategoryCard/g);
  assert.equal((home.match(/CategoryCard/g) ?? []).length, 2);
  assert.match(home, /tower/);
  assert.match(home, /area/);
  assert.match(home, /item/);
  assert.match(home, /achievement/);
  assert.equal((home.match(/PuzzleCard/g) ?? []).length, 4);

  assert.match(puzzles, /puzzleDirectorySeo\.h1/);
  assert.match(puzzles, /source-checked solutions/i);
  assert.match(puzzles, /puzzleDirectorySeo\.description/);
  assert.match(puzzles, /unresolved reports stay out of search indexing/i);
  assert.match(puzzles, /<h2>\{tower\}<\/h2>/);
  assert.match(puzzles, /PuzzleCard/g);
});

test('public discovery is crawlable while placeholder detail URLs stay out of generated discovery', async () => {
  const [sitemap, robots] = await Promise.all([sourceFor('sitemap'), sourceFor('robots')]);

  assert.match(sitemap, /path:\s*'\//);
  assert.match(sitemap, /path:\s*'\/puzzles'/);
  assert.match(sitemap, /guides\s*\.filter\(\(guide\)\s*=>\s*guide\.indexable\)/);
  assert.match(sitemap, /siteSections\s*\.filter\(\(section\)\s*=>\s*section\.indexable\)/);
  assert.doesNotMatch(sitemap, /green-chair-headphones|purple-things|4166-1899|red-tower-map-room/);
  assert.match(robots, /allow:\s*['"]\/['"]/);
  assert.match(robots, /sitemap/);
});

test('directory groups guides by their declared tower instead of an inferred area', async () => {
  const puzzles = await sourceFor('puzzles');

  assert.match(puzzles, /guide\.tower/);
  assert.match(puzzles, /Object\.entries\(guidesByTower\)/);
  assert.doesNotMatch(puzzles, /guide\.area === 'Red Tower'/);
  assert.doesNotMatch(puzzles, /guide\.area !== 'Red Tower'/);
});

test('detail layout keeps a narrow reading column and exposes a mobile-friendly table of contents', async () => {
  const styles = await sourceFor('styles');

  assert.match(styles, /\.guide-page\s*\{[\s\S]*?width:\s*min\(100% - 48px,\s*1120px\)/);
  assert.match(styles, /\.guide-article\s*\{[\s\S]*?max-width:\s*720px/);
  assert.match(styles, /\.guide-toc\s*\{[\s\S]*?display:\s*flex;/);
  assert.match(styles, /\.guide-toc a\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(styles, /@media \(min-width: 1280px\)\s*\{[\s\S]*?\.guide-toc\s*\{[\s\S]*?display:\s*flex;/);
  assert.match(styles, /\.spoiler-gate summary\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(styles, /@media \(max-width: 767px\)\s*\{[\s\S]*?\.guide-article\s*\{[\s\S]*?width:\s*100%/);
});

test('directory cards keep puzzle answers distinct from route walkthroughs', async () => {
  const [puzzles, walkthrough] = await Promise.all([
    sourceFor('puzzles'),
    readFile(new URL('../app/walkthrough/page.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(puzzles, /const puzzleGuides = guides\.filter\(\(guide\) => guide\.kind === 'puzzle'\)/);
  assert.match(puzzles, /puzzleGuides\.reduce/);
  assert.match(walkthrough, /const walkthroughGuides = guides\s*\.filter\(\(guide\) => guide\.kind === 'walkthrough'\)/);
  assert.match(walkthrough, /walkthroughGuides\.map/);
  assert.match(walkthrough, /Where are you stuck\?/);
  const evidencePage = await readFile(new URL('../components/evidence-page.tsx', import.meta.url), 'utf8');
  assert.match(evidencePage, /source-checked routes from evidence-in-progress research/i);
});

test('homepage discovery controls route visitors to real puzzle and walkthrough destinations', async () => {
  const [home, guideComponents] = await Promise.all([
    sourceFor('home'),
    readFile(new URL('../components/guides.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(home, /href="\/puzzles"/);
  assert.match(home, /href="\/walkthrough"/);
  assert.doesNotMatch(home, /readOnly/);
  assert.match(guideComponents, /href: string/);
  assert.match(guideComponents, /<Link className="category-card" href=\{href\}>/);
});

test('homepage counts are derived from the current catalogue and featured links are curated', async () => {
  const home = await sourceFor('home');
  const stats = homepageDirectoryStats();
  const featuredGuides = homepageFeaturedGuideSlugs.map((slug) => guides.find((guide) => guide.slug === slug));

  assert.deepEqual(stats, {
    puzzleEntries: 4,
    walkthroughEntries: 8,
    visualEntries: 4,
    achievements: 13,
  });
  assert.equal(homepageFeaturedGuideSlugs.length, 5);
  assert.equal(new Set(homepageFeaturedGuideSlugs).size, homepageFeaturedGuideSlugs.length);
  assert.ok(featuredGuides.every((guide) => guide?.indexable));
  assert.match(home, /homepageDirectoryStats\(\)/);
  assert.match(home, /featuredGuides\.map/);
  assert.match(home, /Featured:/);
  assert.doesNotMatch(home, /Popular:/);
  assert.doesNotMatch(home, /\.\.\.puzzleGuides\.slice|\.\.\.walkthroughGuides/);
});

test('homepage quick answers route trophy and platform demand to source-checked hubs', async () => {
  const home = await sourceFor('home');

  assert.match(home, /Quick Answers/i);
  assert.match(home, /Can I play with friends on other platforms\?/);
  assert.match(home, /How many trophies are in Big Walk\?/);
  assert.match(home, /href:\s*'\/achievements'/);
  assert.match(home, /href:\s*'\/multiplayer'/);
});

test('achievements and multiplayer hubs are source-checked and indexable', async () => {
  const [achievements, multiplayer] = await Promise.all([
    sourceFor('achievements'),
    sourceFor('multiplayer'),
  ]);

  assert.match(achievements, /Source-checked guide/);
  assert.match(achievements, /Big Walk Trophy & Achievement Guide/);
  assert.match(achievements, /Gamer Social Club/);
  assert.match(achievements, /robots:\s*\{\s*index:\s*true,\s*follow:\s*true\s*\}/);
  assert.match(achievements, /href: '\/walkthrough\/blue-tower-train'/);
  assert.match(achievements, /href: '\/walkthrough\/green-tower-chairlift'/);
  assert.match(achievements, /href: '\/walkthrough\/yellow-tower-tunnels'/);
  assert.doesNotMatch(achievements, /\[planned:\s*\/walkthrough\//);

  assert.match(multiplayer, /Source-checked guide/);
  assert.match(multiplayer, /Quick compatibility table/);
  assert.match(multiplayer, /House House/);
  assert.match(multiplayer, /robots:\s*\{\s*index:\s*true,\s*follow:\s*true\s*\}/);
});

test('the Crosswalk route enters both walkthrough navigation and indexable discovery', () => {
  assert.ok(
    guides
      .filter((guide) => guide.kind === 'walkthrough')
      .some((guide) => guide.slug === 'walkthrough/crosswalk'),
  );
  assert.ok(
    guides
      .filter((guide) => guide.indexable)
      .some((guide) => guide.slug === 'walkthrough/crosswalk'),
  );
});

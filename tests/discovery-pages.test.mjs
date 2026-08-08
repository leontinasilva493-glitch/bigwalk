import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pageFiles = {
  home: '../app/page.tsx',
  puzzles: '../app/puzzles/page.tsx',
  styles: '../app/globals.css',
  sitemap: '../app/sitemap.ts',
  robots: '../app/robots.ts',
};

async function sourceFor(name) {
  return readFile(new URL(pageFiles[name], import.meta.url), 'utf8');
}

test('indexable discovery pages use verification-pending copy and expose the directory structure', async () => {
  const [home, puzzles] = await Promise.all([sourceFor('home'), sourceFor('puzzles')]);

  for (const source of [home, puzzles]) {
    assert.doesNotMatch(source, /All Puzzles Solved/);
    assert.doesNotMatch(source, /Every Puzzle Solved/);
    assert.doesNotMatch(source, /Every Big Walk puzzle solved/);
  }

  assert.match(home, /verified solutions and original marked screenshots are being added only after first-hand verification/i);
  assert.match(home, /Search puzzles\.\.\. try "purple things"/);
  assert.match(home, /How It Works/);
  assert.match(home, /CategoryCard/g);
  assert.equal((home.match(/CategoryCard/g) ?? []).length, 2);
  assert.match(home, /tower/);
  assert.match(home, /area/);
  assert.match(home, /item/);
  assert.match(home, /achievement/);
  assert.equal((home.match(/PuzzleCard/g) ?? []).length, 2);

  assert.match(puzzles, /Big Walk Puzzle Hints/);
  assert.match(puzzles, /verified solutions and original marked screenshots are being added only after first-hand verification/i);
  assert.match(puzzles, /<h2>\{tower\}<\/h2>/);
  assert.match(puzzles, /PuzzleCard/g);
});

test('public discovery is crawlable while placeholder detail URLs stay out of generated discovery', async () => {
  const [sitemap, robots] = await Promise.all([sourceFor('sitemap'), sourceFor('robots')]);

  assert.match(sitemap, /path:\s*'\//);
  assert.match(sitemap, /path:\s*'\/puzzles'/);
  assert.match(sitemap, /guides\s*\.filter\(\(guide\)\s*=>\s*guide\.indexable\)/);
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

test('detail layout keeps a narrow reading column and a desktop-only table of contents', async () => {
  const styles = await sourceFor('styles');

  assert.match(styles, /\.guide-page\s*\{[\s\S]*?width:\s*min\(100% - 48px,\s*1120px\)/);
  assert.match(styles, /\.guide-article\s*\{[\s\S]*?max-width:\s*720px/);
  assert.match(styles, /\.guide-toc\s*\{\s*display:\s*none;/);
  assert.match(styles, /@media \(min-width: 1280px\)\s*\{[\s\S]*?\.guide-toc\s*\{[\s\S]*?display:\s*flex;/);
  assert.match(styles, /\.spoiler-gate summary\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(styles, /@media \(max-width: 767px\)\s*\{[\s\S]*?\.guide-article\s*\{[\s\S]*?width:\s*100%/);
});

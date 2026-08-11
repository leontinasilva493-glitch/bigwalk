import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guides, siteSectionBySlug } from '../lib/content.mjs';

async function sourceFor(path) {
  try {
    return await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return '';
    throw error;
  }
}

test('guide recommendations carry a valid target, relation type, and user-facing reason', () => {
  const validTargets = new Set(['home', 'puzzles', ...guides.map((guide) => guide.slug)]);

  for (const guide of guides) {
    assert.ok(guide.relatedSlugs.length >= 2 && guide.relatedSlugs.length <= 3, `${guide.slug} has 2-3 next steps`);
    assert.equal(new Set(guide.relatedSlugs.map((related) => related.slug)).size, guide.relatedSlugs.length, `${guide.slug} has unique next steps`);
    for (const related of guide.relatedSlugs) {
      assert.equal(typeof related, 'object', `${guide.slug} recommendation is structured`);
      assert.ok(validTargets.has(related.slug), `${guide.slug} points to a real destination`);
      assert.notEqual(related.slug, guide.slug, `${guide.slug} does not recommend itself`);
      assert.match(related.relationType, /\S/, `${guide.slug} explains the relation type`);
      assert.match(related.reason, /\S/, `${guide.slug} explains why to continue`);
    }
  }
});

test('next-step cards render after the core answer and before the spoiler solution', async () => {
  const [puzzlePage, walkthroughPage, components] = await Promise.all([
    sourceFor('app/puzzles/[...slug]/page.tsx'),
    sourceFor('app/walkthrough/[...slug]/page.tsx'),
    sourceFor('components/guides.tsx'),
  ]);

  assert.match(components, /export function NextStepRecommendations/);
  assert.match(components, /related\.relationType/);
  assert.match(components, /related\.reason/);

  const puzzleOverview = puzzlePage.indexOf('<PuzzleMvpOverview');
  const puzzleNextSteps = puzzlePage.indexOf('<NextStepRecommendations');
  const puzzleSolution = puzzlePage.indexOf('<VerificationPanel');
  assert.ok(puzzleNextSteps > puzzleOverview && puzzleNextSteps < puzzleSolution);

  const walkthroughHint = walkthroughPage.indexOf('<HintBlock');
  const walkthroughNextSteps = walkthroughPage.indexOf('<NextStepRecommendations');
  const walkthroughSolution = walkthroughPage.indexOf('<VerificationPanel');
  assert.ok(walkthroughNextSteps > walkthroughHint && walkthroughNextSteps < walkthroughSolution);
});

test('page-end navigation has one heading and derives same-kind previous and next guides', async () => {
  const [puzzlePage, walkthroughPage, components] = await Promise.all([
    sourceFor('app/puzzles/[...slug]/page.tsx'),
    sourceFor('app/walkthrough/[...slug]/page.tsx'),
    sourceFor('components/guides.tsx'),
  ]);

  assert.doesNotMatch(puzzlePage, /Related Big Walk guides/);
  assert.doesNotMatch(walkthroughPage, /Related Big Walk guides/);
  assert.match(puzzlePage, /<RelatedGuides guide=\{guide\}/);
  assert.match(walkthroughPage, /<RelatedGuides guide=\{guide\}/);
  assert.match(components, /guide\.kind/);
  assert.match(components, /Previous/);
  assert.match(components, /Next/);
});

test('homepage and puzzle directory counts derive from the content arrays', async () => {
  const [home, puzzles] = await Promise.all([
    sourceFor('app/page.tsx'),
    sourceFor('app/puzzles/page.tsx'),
  ]);

  for (const source of [home, puzzles]) {
    assert.doesNotMatch(source, /count:\s*'1 entry'/);
    assert.doesNotMatch(source, /count:\s*'1 route'/);
    assert.match(source, /puzzleGuides\.length/);
    assert.match(source, /walkthroughGuides\.length/);
  }
});

test('walkthrough is a noindex route center built from current walkthrough data', async () => {
  const page = await sourceFor('app/walkthrough/page.tsx');
  const section = siteSectionBySlug('walkthrough');

  assert.equal(section.indexable, false);
  assert.match(page, /evidenceMetadata\(page\)/);
  assert.doesNotMatch(page, /<EvidencePage/);
  assert.match(page, /Route map/);
  assert.match(page, /Where are you stuck\?/);
  assert.match(page, /Prerequisite/);
  assert.match(page, /Player count/);
  assert.match(page, /Unlock result/);
  assert.match(page, /guide\.updated/);
  assert.match(page, /walkthrough\/green-tower-chairlift/);
  assert.match(page, /walkthrough\/yellow-tower-tunnels/);
  assert.match(page, /walkthrough\/radio-channels/);
  assert.match(page, /walkthrough\/green-room/);
});

test('video evidence waits for user action before creating the YouTube iframe', async () => {
  const [guidesSource, playerSource] = await Promise.all([
    sourceFor('components/guides.tsx'),
    sourceFor('components/youtube-embed.tsx'),
  ]);

  assert.match(guidesSource, /<YouTubeEmbed/);
  assert.doesNotMatch(guidesSource, /<iframe/);
  assert.match(playerSource, /'use client'/);
  assert.match(playerSource, /useState\(false\)/);
  assert.match(playerSource, /Load video/);
  assert.match(playerSource, /youtube-nocookie\.com\/embed/);
});

test('mobile readers get an inline table of contents and card-style recovery steps', async () => {
  const styles = await sourceFor('app/globals.css');

  assert.match(styles, /\.guide-toc\s*\{[\s\S]*?display:\s*flex/);
  assert.match(styles, /@media \(max-width: 767px\)[\s\S]*?\.route-recovery thead\s*\{\s*display:\s*none/);
  assert.match(styles, /@media \(max-width: 767px\)[\s\S]*?\.route-recovery tbody tr\s*\{[\s\S]*?display:\s*grid/);
});

test('the published beginner guide enters sitemap discovery through indexable sections', async () => {
  const sitemap = await sourceFor('app/sitemap.ts');
  const beginner = siteSectionBySlug('beginner-guide');

  assert.equal(beginner.indexable, true);
  assert.match(sitemap, /siteSections\s*\.filter\(\(section\)\s*=>\s*section\.indexable\)/);
});

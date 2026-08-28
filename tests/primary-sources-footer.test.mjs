import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('primary source view keeps only the linked source identity', async () => {
  const { primarySourcesView } = await import('../lib/primary-sources.mjs');
  const view = primarySourcesView([
    {
      title: 'Big Walk Version History',
      publisher: 'House House and Panic',
      url: 'https://bigwalk.game/history/',
      note: 'Long evidence explanation that should not render.',
      purpose: 'Another internal source note.',
    },
  ]);

  assert.deepEqual(view, {
    heading: 'Primary sources',
    sources: [{
      title: 'Big Walk Version History',
      publisher: 'House House and Panic',
      url: 'https://bigwalk.game/history/',
    }],
  });
});

test('source-bearing page shells place the shared primary source footer after related content', async () => {
  const files = [
    '../app/puzzles/[...slug]/page.tsx',
    '../app/walkthrough/[...slug]/page.tsx',
    '../components/beginner-guide.tsx',
    '../components/evidence-page.tsx',
    '../components/troubleshooting-guide.tsx',
    '../app/multiplayer/page.tsx',
    '../app/multiplayer/how-to-find-players/page.tsx',
    '../app/multiplayer/hosting-and-saves/page.tsx',
    '../app/beginner-guide/lost-items-and-lost-found/page.tsx',
    '../app/achievements/page.tsx',
  ];

  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const footerPosition = Math.max(source.lastIndexOf('<PrimarySources'), source.lastIndexOf('<GuideSources'));
    const relatedPosition = Math.max(source.lastIndexOf('<RelatedGuides'), source.lastIndexOf('className="related-guides"'), source.lastIndexOf('beginner-related-grid'));
    assert.ok(footerPosition > relatedPosition, `${file} should render primary sources after related content`);
  }
});

test('public page source headings use the single primary sources label', async () => {
  const files = [
    '../components/guides.tsx',
    '../components/beginner-guide.tsx',
    '../components/evidence-page.tsx',
    '../components/troubleshooting-guide.tsx',
    '../app/multiplayer/page.tsx',
    '../app/multiplayer/how-to-find-players/page.tsx',
    '../app/multiplayer/hosting-and-saves/page.tsx',
    '../app/beginner-guide/lost-items-and-lost-found/page.tsx',
    '../app/achievements/page.tsx',
    '../app/map/page.tsx',
    '../app/patch-notes/page.tsx',
  ];
  const bannedHeadings = [
    'Sources and evidence limits',
    'Sources and unresolved limits',
    'Sources and limits',
    'Sources and version notes',
    'Sources and version context',
    'Sources, videos, and current-version notes',
    '>Research sources<',
    '>Source links<',
    'Official rules and current community channels',
    'Map sources and boundaries',
  ];

  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    for (const heading of bannedHeadings) {
      assert.ok(!source.includes(heading), `${file} should not contain the retired heading: ${heading}`);
    }
  }
});

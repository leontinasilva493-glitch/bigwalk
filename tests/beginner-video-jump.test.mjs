import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [beginnerSource, styles] = await Promise.all([
  readFile(new URL('../components/beginner-guide.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../app/globals.css', import.meta.url), 'utf8'),
]);

test('beginner hero links to the official video between guide meta and the introduction', () => {
  assert.match(beginnerSource, /import \{ VideoAfterLinks, VideoJumpLink \} from '\.\/guides';/);

  const guideMeta = beginnerSource.indexOf('<p className="guide-meta">');
  const videoJump = beginnerSource.indexOf('<VideoJumpLink href="#official-video" />');
  const intro = beginnerSource.indexOf('<div className="beginner-guide-intro">');

  assert.ok(guideMeta >= 0, 'the existing guide meta is present');
  assert.ok(videoJump > guideMeta, 'the official-video jump follows the guide meta');
  assert.ok(intro > videoJump, 'the introduction follows the official-video jump');
});

test('video jump keeps a 44px underlined single-line link and video anchors clear the header', () => {
  assert.match(styles, /\.video-jump-link\s*\{[^}]*display:\s*inline-flex[^}]*align-items:\s*center[^}]*min-height:\s*44px[^}]*margin-top:\s*\d+px[^}]*color:\s*var\(--forest\)[^}]*font-weight:\s*700[^}]*text-decoration:\s*underline[^}]*text-underline-offset:\s*\d+px[^}]*white-space:\s*nowrap/s);
  assert.match(styles, /\.guide-video\s*,\s*\.beginner-video-section\s*\{[^}]*scroll-margin-top:\s*24px/s);
});

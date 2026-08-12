import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('beginner guide defers YouTube until the reader asks to load it', async () => {
  const source = await readFile(new URL('../components/beginner-guide.tsx', import.meta.url), 'utf8');

  assert.match(source, /import \{ YouTubeEmbed \} from '\.\/youtube-embed'/);
  assert.match(source, /<YouTubeEmbed\s+id=\{content\.officialVideo\.id\}/);
  assert.doesNotMatch(source, /<iframe/);
});

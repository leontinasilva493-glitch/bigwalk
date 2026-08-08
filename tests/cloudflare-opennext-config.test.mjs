import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('the Cloudflare Worker identity and self-reference use the same deployed Worker', async () => {
  const config = JSON.parse(await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));

  assert.equal(config.name, 'bigwalk');
  assert.equal(config.main, '.open-next/worker.js');
  assert.equal(config.assets?.directory, '.open-next/assets');
  assert.equal(config.services?.find((binding) => binding.binding === 'WORKER_SELF_REFERENCE')?.service, 'bigwalk');
  assert.equal(config.r2_buckets?.find((binding) => binding.binding === 'NEXT_INC_CACHE_R2_BUCKET')?.bucket_name, 'big-walk-walkthrough-opennext-cache');
});

test('the project owns its OpenNext build and deployment commands', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

  assert.equal(manifest.scripts['cf:build'], 'opennextjs-cloudflare build');
  assert.equal(manifest.scripts['cf:deploy'], 'opennextjs-cloudflare deploy');
  assert.ok(manifest.devDependencies['@opennextjs/cloudflare']);
  assert.ok(manifest.devDependencies.wrangler);
});

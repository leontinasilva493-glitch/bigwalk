import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

test('Google Analytics bootstrap records the GA4 initialization and configured property', async () => {
  const analytics = await import('../lib/google-analytics.mjs').catch(() => null);

  assert.ok(analytics, 'the Google Analytics bootstrap exists');

  const context = { Date };
  context.window = context;

  vm.runInNewContext(analytics.createGoogleAnalyticsBootstrap(), context);

  const calls = context.dataLayer.map((entry) => Array.from(entry));

  assert.equal(calls.length, 2);
  assert.equal(calls[0][0], 'js');
  assert.ok(calls[0][1] instanceof Date);
  assert.deepEqual(calls[1], ['config', 'G-1EFZKE8S00']);
});

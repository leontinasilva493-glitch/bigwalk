const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const baseUrl = 'http://127.0.0.1:3010';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto(`${baseUrl}/multiplayer/how-to-find-players`);
  await page.waitForLoadState('networkidle');

  assert.equal(await page.title(), 'Big Walk LFG: How to Find Players & Join a Group');
  assert.equal(
    await page.locator('meta[name="description"]').getAttribute('content'),
    'No public matchmaking in Big Walk? Find teammates via the daily Reddit LFG thread, Steam discussions, and community Discord — with a safe posting template.',
  );
  assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /index/);
  assert.equal(await page.getByRole('heading', { name: 'How to Find Big Walk Players (LFG Guide)' }).count(), 1);
  assert.equal(await page.locator('.lfg-channel-card').count(), 3);
  assert.deepEqual(await page.getByRole('heading', { level: 2 }).allTextContents(), [
    'Active LFG channels',
    'Safe posting template',
    'Safety notes',
    'Related pages',
  ]);

  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  const article = jsonLd.map(JSON.parse).find((item) => item['@type'] === 'Article');
  assert.equal(article.headline, 'How to Find Big Walk Players (LFG Guide)');
  assert.equal(article.dateModified, '2026-08-14');

  const sitemapResponse = await page.request.get(`${baseUrl}/sitemap.xml`);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/bigwalkwalkthrough\.com\/multiplayer\/how-to-find-players/);
  assert.match(sitemap, /2026-08-14/);

  await page.goto(`${baseUrl}/beginner-guide`);
  await page.waitForLoadState('networkidle');
  assert.ok(await page.locator('a[href="/multiplayer/how-to-find-players"]').count() >= 1);

  await page.goto(`${baseUrl}/puzzles/4166-1899-coordinates`);
  await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('a[href="/puzzles#visual-finder"]').count(), 1);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/multiplayer/how-to-find-players`);
  await page.waitForLoadState('networkidle');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  assert.ok(await page.locator('.lfg-channel-card a').first().evaluate((element) => element.getBoundingClientRect().height) >= 44);
  assert.deepEqual(consoleErrors, []);

  console.log('LFG browser smoke passed: metadata, content order, sitemap, internal links, and 390px layout');
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

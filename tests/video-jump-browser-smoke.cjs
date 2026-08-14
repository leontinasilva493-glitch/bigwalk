const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const baseUrl = 'http://127.0.0.1:3010';
const videoPages = [
  ['/beginner-guide', '#official-video'],
  ['/puzzles/4166-1899-coordinates', '#video-puzzles-4166-1899-coordinates'],
  ['/walkthrough/red-tower-map-room', '#video-walkthrough-red-tower-map-room'],
  ['/walkthrough/green-tower-chairlift', '#video-walkthrough-green-tower-chairlift'],
  ['/walkthrough/yellow-tower-tunnels', '#video-walkthrough-yellow-tower-tunnels'],
  ['/walkthrough/radio-channels', '#video-walkthrough-radio-channels'],
];
const pagesWithoutEmbeddedVideo = [
  '/walkthrough/green-room',
  '/puzzles/peg-puzzle',
];
let browser;

(async () => {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 320, height: 844 } });
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  for (const [path, target] of videoPages) {
    console.log(`[video-smoke] opening ${path}`);
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
    await page.locator('main').waitFor();

    const link = page.locator('.video-jump-link');
    assert.equal(await link.count(), 1, `${path} has one video jump`);
    assert.equal(await link.textContent(), '▶ Watch video ↓', `${path} uses the approved copy`);
    assert.equal(await link.getAttribute('href'), target, `${path} targets its embedded video`);
    assert.equal(await page.locator('iframe[title]').count(), 0, `${path} has not loaded YouTube before the jump`);

    const presentation = await link.evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        height: rect.height,
        right: rect.right,
        whiteSpace: style.whiteSpace,
        decoration: style.textDecorationLine,
      };
    });
    assert.ok(presentation.height >= 44, `${path} keeps a 44px touch target`);
    assert.ok(presentation.right <= 320, `${path} remains inside the 320px viewport`);
    assert.equal(presentation.whiteSpace, 'nowrap', `${path} stays on one line`);
    assert.match(presentation.decoration, /underline/, `${path} visibly signals a link`);

    console.log(`[video-smoke] jumping to video on ${path}`);
    await link.click();
    console.log(`[video-smoke] video jump settled on ${path}`);
    assert.equal(new URL(page.url()).hash, target, `${path} updates to the video anchor`);
    assert.equal(await page.locator(target).count(), 1, `${path} has a real landing target`);
    assert.equal(await page.locator('iframe[title]').count(), 0, `${path} does not load YouTube from the jump`);
    const videoSection = path === '/beginner-guide' ? page.locator('.beginner-video-section') : page.locator(target);
    assert.equal(await videoSection.getByRole('button', { name: /Load video/i }).count(), 1, `${path} preserves click-to-load`);
    console.log(`[video-smoke] player verified on ${path}`);

    const afterVideo = videoSection.locator('.video-after-links');
    const backLink = afterVideo.locator('.video-back-link');
    const sourceLink = afterVideo.locator('.video-source-link');
    assert.equal(await afterVideo.count(), 1, `${path} has one action row below the video`);
    assert.equal(await backLink.textContent(), '↑ Back to guide', `${path} uses the approved return copy`);
    assert.equal(await backLink.getAttribute('href'), '#guide-top', `${path} returns to the guide hero`);
    assert.equal(await sourceLink.textContent(), 'Watch this video on YouTube', `${path} uses the approved YouTube copy`);
    assert.match(await sourceLink.getAttribute('href'), /^https:\/\/www\.youtube\.com\/watch\?v=/, `${path} retains the original YouTube fallback`);
    assert.equal(await sourceLink.getAttribute('target'), '_blank', `${path} opens YouTube separately`);
    console.log(`[video-smoke] links verified on ${path}`);

    const actionLayout = await afterVideo.evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const videoRect = element.closest('section')?.querySelector('.video-frame')?.getBoundingClientRect();
      const backRect = element.querySelector('.video-back-link')?.getBoundingClientRect();
      const source = element.querySelector('.video-source-link');
      const sourceRect = source?.getBoundingClientRect();
      const sourceStyle = source ? getComputedStyle(source) : undefined;
      return {
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        right: rect.right,
        whiteSpace: style.whiteSpace,
        followsVideo: Boolean(videoRect && rect.top >= videoRect.bottom),
        sourceRightOffset: sourceRect ? Math.abs(rect.right - sourceRect.right) : Infinity,
        linkGap: backRect && sourceRect ? sourceRect.left - backRect.right : 0,
        sourceFontSize: sourceStyle ? Number.parseFloat(sourceStyle.fontSize) : Infinity,
      };
    });
    assert.ok(actionLayout.followsVideo, `${path} places the action row below the player`);
    assert.ok(actionLayout.scrollWidth <= actionLayout.clientWidth, `${path} keeps the action row on one line`);
    assert.ok(actionLayout.right <= 320, `${path} keeps the action row inside the 320px viewport`);
    assert.equal(actionLayout.whiteSpace, 'nowrap', `${path} prevents the short action row from wrapping`);
    assert.ok(actionLayout.sourceRightOffset <= 1, `${path} aligns the YouTube link with the player right edge`);
    assert.ok(actionLayout.linkGap >= 16, `${path} visually separates the return and YouTube actions`);
    assert.ok(actionLayout.sourceFontSize <= 13, `${path} keeps the longer secondary copy compact on mobile`);
    console.log(`[video-smoke] layout verified on ${path}`);

    console.log(`[video-smoke] returning to guide on ${path}`);
    await backLink.click();
    assert.equal(new URL(page.url()).hash, '#guide-top', `${path} updates to the guide-top anchor`);
    assert.equal(await page.locator('#guide-top').count(), 1, `${path} has one real guide-top target`);
    const returnPosition = await page.locator('#guide-top').evaluate((element) => {
      const targetRect = element.getBoundingClientRect();
      const headingRect = element.querySelector('h1')?.getBoundingClientRect();
      return {
        targetTop: targetRect.top,
        headingTop: headingRect?.top ?? Infinity,
        headingBottom: headingRect?.bottom ?? Infinity,
      };
    });
    assert.ok(returnPosition.targetTop >= -1 && returnPosition.targetTop <= 24, `${path} aligns the guide hero with the mobile viewport top`);
    assert.ok(returnPosition.headingTop >= 0 && returnPosition.headingBottom <= 844, `${path} returns with the page H1 inside the first mobile screen`);
    assert.equal(await page.locator('iframe[title]').count(), 0, `${path} keeps YouTube lazy after returning to the guide`);
    console.log(`[video-smoke] completed ${path}`);
  }

  for (const path of pagesWithoutEmbeddedVideo) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
    await page.locator('main').waitFor();
    assert.equal(await page.locator('.video-jump-link').count(), 0, `${path} does not advertise a missing player`);
  }

  assert.deepEqual(consoleErrors, []);
  console.log('Video navigation browser smoke passed: 6 positive pages, 2 negative pages, 320px action rows, round-trip anchors, and lazy loading');
  await browser.close();
})().catch(async (error) => {
  console.error(error);
  await browser?.close();
  process.exitCode = 1;
});

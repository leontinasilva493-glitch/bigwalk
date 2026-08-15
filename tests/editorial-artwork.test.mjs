import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { basename, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const componentPath = 'components/editorial-artwork.tsx';
const intendedSurfaces = [
  'app/methodology/page.tsx',
  'app/multiplayer/how-to-find-players/page.tsx',
  'components/troubleshooting-guide.tsx',
  'app/achievements/page.tsx',
];

async function sourceFor(path) {
  return readFile(new URL(path, root), 'utf8');
}

function artworkUsage(source) {
  return source.match(/<EditorialArtwork\b[\s\S]*?\/>/)?.[0] ?? '';
}

function literalProp(usage, name) {
  const match = usage.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`));
  return match?.[1] ?? match?.[2] ?? null;
}

function expressionProp(usage, name) {
  return usage.match(new RegExp(`\\b${name}=\\{([A-Za-z_$][\\w$]*)\\}`))?.[1] ?? null;
}

function staticImportFor(source, identifier) {
  if (!identifier) return null;

  const escapedIdentifier = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.match(new RegExp(
    `import\\s+${escapedIdentifier}\\s+from\\s+['"]([^'"]+\\.webp)['"]`,
  ))?.[1] ?? null;
}

function assertDescriptiveEditorialAsset(path, messagePrefix) {
  const normalized = path.replaceAll('\\', '/');
  const filename = basename(normalized);

  assert.match(
    normalized,
    /(?:^|\/)public\/images\/editorial\/(?:[a-z0-9]+-)+[a-z0-9]+\.webp$/,
    `${messagePrefix} must use a descriptive WebP filename under public/images/editorial/`,
  );
  assert.doesNotMatch(
    filename,
    /\b(?:evidence|original|gameplay|screenshot|capture)\b/i,
    `${messagePrefix} filename must describe the editorial scene without implying gameplay evidence`,
  );
}

async function assertArtworkIntegration(path, componentSource) {
  const source = await sourceFor(path);
  const usage = artworkUsage(source);

  assert.match(
    source,
    /import\s+\{\s*EditorialArtwork\s*\}\s+from\s+['"][^'"]+editorial-artwork['"]/,
    `${path} must import the reusable EditorialArtwork component`,
  );
  assert.ok(usage, `${path} must render EditorialArtwork`);

  const variant = literalProp(usage, 'variant');
  assert.ok(variant?.trim(), `${path} must provide a non-empty artwork variant`);

  const alt = literalProp(usage, 'alt');
  assert.ok(alt?.trim(), `${path} must provide descriptive alt text`);
  assert.doesNotMatch(
    alt,
    /\b(?:evidence|original|gameplay|screenshot|capture|footage)\b/i,
    `${path} alt text must describe the editorial scene without implying gameplay evidence`,
  );
  assert.doesNotMatch(usage, /\bcaption=/, `${path} must not render visible artwork caption copy`);

  const literalSrc = literalProp(usage, 'src');
  const sourceIdentifier = expressionProp(usage, 'src');
  const staticImport = staticImportFor(source, sourceIdentifier);
  const componentImage = componentSource.match(/<Image\b[\s\S]*?\/>/)?.[0] ?? '';
  const componentHasDimensions = /\bwidth=/.test(componentImage) && /\bheight=/.test(componentImage);
  const usageHasDimensions = /\bwidth=/.test(usage) && /\bheight=/.test(usage);

  assert.ok(
    literalSrc || staticImport,
    `${path} artwork src must be a local URL literal or a local static WebP import`,
  );
  assert.ok(
    staticImport || componentHasDimensions || usageHasDimensions,
    `${path} local artwork src must have explicit width and height`,
  );

  let assetUrl;
  if (literalSrc) {
    assert.match(
      literalSrc,
      /^\/images\/editorial\/(?:[a-z0-9]+-)+[a-z0-9]+\.webp$/,
      `${path} must use a descriptive WebP URL under /images/editorial/`,
    );
    assertDescriptiveEditorialAsset(`public${literalSrc}`, path);
    assetUrl = new URL(`public${literalSrc}`, root);
  } else {
    const pageUrl = new URL(path, root);
    assetUrl = new URL(staticImport, pageUrl);
    assertDescriptiveEditorialAsset(fileURLToPath(assetUrl), path);
  }

  await assert.doesNotReject(
    access(assetUrl),
    `${path} must reference an existing local editorial WebP asset`,
  );

  return { assetUrl: assetUrl.href, variant };
}

async function tsxFilesBelow(directory) {
  const directoryUrl = new URL(`${directory}/`, root);
  const entries = await readdir(directoryUrl, { withFileTypes: true, recursive: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
    .map((entry) => {
      const parent = resolve(fileURLToPath(directoryUrl), entry.parentPath ?? entry.path);
      return relative(fileURLToPath(root), resolve(parent, entry.name)).replaceAll('\\', '/');
    });
}

test('EditorialArtwork renders a responsive Next image without visible caption copy', async () => {
  await assert.doesNotReject(
    access(new URL(componentPath, root)),
    `${componentPath} must exist`,
  );

  const source = await sourceFor(componentPath);
  const figure = source.match(/<figure\b[\s\S]*?<\/figure>/)?.[0] ?? '';
  const image = figure.match(/<Image\b[\s\S]*?\/>/)?.[0] ?? '';

  assert.match(source, /import\s+Image\s+from\s+['"]next\/image['"]/);
  assert.match(figure, /editorial-artwork/);
  assert.match(figure, /editorial-artwork--[^`'"}]*\$\{variant\}|editorial-artwork--\$\{variant\}/);
  assert.match(image, /\bsrc=\{src\}/);
  assert.match(image, /\balt=\{alt\}/);
  assert.match(image, /\bsizes=(?:"[^"]+"|\{[^}]+\})/);
  assert.match(image, /\bpreload=\{preload\}/);
  assert.doesNotMatch(source, /\bcaption\??\s*:/, 'the reusable API must not accept visible caption copy');
  assert.doesNotMatch(figure, /<figcaption\b|AI-created editorial illustration|not a gameplay screenshot/i);
});

for (const path of intendedSurfaces) {
  test(`${path} integrates one local editorial artwork`, async () => {
    let componentSource = '';
    try {
      componentSource = await sourceFor(componentPath);
    } catch {
      // The integration assertions still report each missing production boundary during RED.
    }
    await assertArtworkIntegration(path, componentSource);
  });
}

test('troubleshooting artwork appears in the hub only, not individual diagnostic guides', async () => {
  const source = await sourceFor('components/troubleshooting-guide.tsx');
  const guideStart = source.indexOf('export function TroubleshootingGuide');
  const hubStart = source.indexOf('export function TroubleshootingHub');

  assert.ok(guideStart >= 0 && hubStart > guideStart, 'troubleshooting exports must remain inspectable');
  assert.doesNotMatch(
    source.slice(guideStart, hubStart),
    /<EditorialArtwork\b/,
    'individual troubleshooting guides must not render the hub editorial artwork',
  );
  assert.match(
    source.slice(hubStart),
    /<EditorialArtwork\b/,
    'TroubleshootingHub must render the editorial artwork',
  );
});

test('EditorialArtwork is rendered on exactly the four intended surfaces', async () => {
  const files = [...await tsxFilesBelow('app'), ...await tsxFilesBelow('components')];
  const consumers = [];

  for (const path of files) {
    if (path === componentPath) continue;
    const source = await sourceFor(path);
    if (/<EditorialArtwork\b/.test(source)) consumers.push(path);
  }

  assert.deepEqual(consumers.sort(), intendedSurfaces.toSorted());
});

test('hero artwork URLs and alt text carry each page topic without implying gameplay proof', async () => {
  const expectations = new Map([
    ['app/methodology/page.tsx', {
      src: '/images/editorial/big-walk-methodology-guide-workflow.webp',
      alt: /big walk.*methodology/i,
    }],
    ['app/multiplayer/how-to-find-players/page.tsx', {
      src: '/images/editorial/big-walk-find-players-lfg-guide.webp',
      alt: /big walk.*(?:find players|lfg)/i,
    }],
    ['components/troubleshooting-guide.tsx', {
      src: '/images/editorial/big-walk-troubleshooting-help-fixes-guide.webp',
      alt: /big walk.*troubleshooting/i,
    }],
    ['app/achievements/page.tsx', {
      src: '/images/editorial/big-walk-achievements-trophy-guide.webp',
      alt: /big walk.*(?:achievements|trophy)/i,
    }],
  ]);

  for (const [path, expectation] of expectations) {
    const source = await sourceFor(path);
    const usage = artworkUsage(source);
    assert.equal(
      literalProp(usage, 'src'),
      expectation.src,
      `${path} must use the approved topic-specific public image URL`,
    );
    const alt = literalProp(usage, 'alt') ?? '';
    assert.match(alt, expectation.alt, `${path} alt text must identify the page topic naturally`);
    assert.ok(alt.length >= 45 && alt.length <= 160, `${path} alt text must stay descriptive and concise`);
  }
});

test('each artwork is the semantic first-screen hero with text before media and LCP preloading', async () => {
  for (const path of intendedSurfaces) {
    const source = await sourceFor(path);
    const usage = artworkUsage(source);
    const usageStart = source.indexOf(usage);
    const heroStart = source.lastIndexOf('<header', usageStart);
    const heroEnd = source.indexOf('</header>', usageStart);
    const hero = heroStart >= 0 && heroEnd > usageStart ? source.slice(heroStart, heroEnd) : '';

    assert.match(hero, /className="[^"]*editorial-page-hero[^"]*"/, `${path} must place artwork in its page hero`);
    assert.match(hero, /className="editorial-page-hero__copy"/, `${path} must group readable hero copy`);
    assert.ok(hero.indexOf('<h1') < hero.indexOf('<EditorialArtwork'), `${path} must keep H1 copy before media on mobile`);
    assert.equal(literalProp(usage, 'placement'), 'hero', `${path} must opt into hero artwork behavior`);
    assert.match(usage, /\bpreload\b/, `${path} hero image must be preloaded as the likely LCP asset`);
  }
});

test('achievements keeps detailed platform totals below the fixed-height desktop hero', async () => {
  const source = await sourceFor('app/achievements/page.tsx');
  const heroStart = source.indexOf('<header className="guide-hero editorial-page-hero">');
  const heroEnd = source.indexOf('</header>', heroStart);
  const overviewStart = source.indexOf('<section className="route-overview"', heroEnd);
  const overviewEnd = source.indexOf('</section>', overviewStart);
  const hero = source.slice(heroStart, heroEnd);
  const overview = source.slice(overviewStart, overviewEnd);

  assert.doesNotMatch(hero, /className="compact-facts"/, 'desktop hero copy must not exceed its visual frame');
  assert.match(overview, /className="compact-facts"/, 'platform totals must remain visible in the route overview');
});

test('page metadata exposes the topic artwork for large social previews', async () => {
  const expectations = new Map([
    ['app/methodology/page.tsx', '/images/editorial/big-walk-methodology-guide-workflow.webp'],
    ['app/multiplayer/how-to-find-players/page.tsx', '/images/editorial/big-walk-find-players-lfg-guide.webp'],
    ['app/troubleshooting/page.tsx', '/images/editorial/big-walk-troubleshooting-help-fixes-guide.webp'],
    ['app/achievements/page.tsx', '/images/editorial/big-walk-achievements-trophy-guide.webp'],
  ]);

  for (const [path, expectedSource] of expectations) {
    const source = await sourceFor(path);
    const occurrences = source.split(expectedSource).length - 1;
    assert.ok(occurrences >= 2, `${path} must use the artwork in both Open Graph and Twitter metadata`);
    assert.match(source, /openGraph\s*:[\s\S]*?images\s*:/, `${path} must provide an Open Graph image`);
    assert.match(source, /twitter\s*:[\s\S]*?card\s*:\s*['"]summary_large_image['"][\s\S]*?images\s*:/, `${path} must provide a large Twitter image`);
  }
});

test('existing JSON-LD articles and collection identify their related artwork', async () => {
  const expectations = new Map([
    ['app/multiplayer/how-to-find-players/page.tsx', '/images/editorial/big-walk-find-players-lfg-guide.webp'],
    ['components/troubleshooting-guide.tsx', '/images/editorial/big-walk-troubleshooting-help-fixes-guide.webp'],
    ['app/achievements/page.tsx', '/images/editorial/big-walk-achievements-trophy-guide.webp'],
  ]);

  for (const [path, expectedSource] of expectations) {
    const source = await sourceFor(path);
    assert.match(
      source,
      new RegExp(`(?:image|primaryImageOfPage)\\s*:\\s*[^\\n]*${expectedSource.replaceAll('/', '\\/')}`),
      `${path} structured data must connect the page topic to its artwork`,
    );
  }
});

test('editorial hero CSS overlays readable desktop copy and restores text-first flow on mobile', async () => {
  const styles = await sourceFor('app/globals.css');
  const figureRule = styles.match(/\.editorial-artwork\s*\{[^}]*\}/s)?.[0] ?? '';
  const imageRule = styles.match(/\.editorial-artwork(?:__media)?\s+img\s*\{[^}]*\}/s)?.[0] ?? '';
  const heroRule = styles.match(/\.editorial-page-hero\s*\{[^}]*\}/s)?.[0] ?? '';
  const heroCopyRule = styles.match(/\.editorial-page-hero__copy\s*\{[^}]*\}/s)?.[0] ?? '';
  const heroArtworkRule = styles.match(/\.editorial-artwork--hero\s*\{[^}]*\}/s)?.[0] ?? '';
  const heroCopyAlpha = Number(heroCopyRule.match(/\bbackground:\s*rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/)?.[1]);
  const mobileStart = styles.indexOf('@media (max-width: 900px)');
  const nextMedia = styles.indexOf('@media (max-width: 767px)', mobileStart);
  const mobileRules = mobileStart >= 0
    ? styles.slice(mobileStart, nextMedia > mobileStart ? nextMedia : undefined)
    : '';

  assert.match(figureRule, /\bwidth:\s*100%/);
  assert.match(imageRule, /\bwidth:\s*100%/);
  assert.match(imageRule, /\bheight:\s*auto/);
  assert.match(imageRule, /\bobject-fit:\s*cover/);
  assert.doesNotMatch(styles, /\.editorial-artwork(?:__caption|\s+figcaption)\b/);
  assert.match(heroRule, /\bposition:\s*relative/);
  assert.match(heroRule, /\boverflow:\s*hidden/);
  assert.match(heroRule, /\baspect-ratio:\s*3\s*\/\s*2/);
  assert.match(heroCopyRule, /\bz-index:\s*[1-9]/);
  assert.match(heroCopyRule, /\bbackground:/);
  assert.ok(
    heroCopyAlpha >= 0.49 && heroCopyAlpha <= 0.51,
    'desktop hero copy panel must visibly blend with the artwork while retaining readable contrast',
  );
  assert.match(heroCopyRule, /\bbackdrop-filter:\s*blur\((?:1[0-9]|[2-9][0-9])px\)/);
  assert.match(heroArtworkRule, /\bposition:\s*absolute/);
  assert.match(heroArtworkRule, /\binset:\s*0/);
  assert.match(mobileRules, /\.editorial-page-hero\s*\{[^}]*\baspect-ratio:\s*auto/s);
  assert.match(mobileRules, /\.editorial-page-hero\s*\{[^}]*\boverflow:\s*visible/s);
  assert.match(mobileRules, /\.editorial-artwork--hero\s*\{[^}]*\bposition:\s*relative/s);
  assert.match(mobileRules, /\.editorial-artwork--hero\s+\.editorial-artwork__media\s*\{[^}]*\baspect-ratio:\s*4\s*\/\s*3/s);
});

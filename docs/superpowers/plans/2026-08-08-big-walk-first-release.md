# Big Walk First Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone static-first Big Walk guide site at the workspace root with the approved first six URLs.

**Architecture:** A root Next.js App Router project consumes a single typed guide catalogue. Server components render all guide body content, metadata, navigation, internal links, and Article/BreadcrumbList schema directly into HTML. Details pages deliberately use verification-status content instead of fabricated puzzle solutions or screenshots.

**Tech Stack:** Next.js 14, React 18, TypeScript, CSS modules-free global CSS, Node test runner.

## Global Constraints

- Do not modify or import anything from `游戏站脚手架-main/`; it is an unused historical scaffold.
- Metadata titles, H1 values, and descriptions must exactly match `网站结构文档.txt`.
- Detail pages must never claim an unverified puzzle solution or show a fabricated screenshot.
- Use Article plus BreadcrumbList JSON-LD only; do not emit FAQPage schema.
- Detail pages must render a spoiler-free hint before the verification-status solution panel.
- Detail pages must be `noindex, follow` until their verified solution and original WebP screenshots are supplied.
- Implement the supplied `paper`, `forest`, `amber`, `spoiler`, and `night` design tokens, 44px touch targets, and responsive 720px reading column.

---

### Task 1: Project foundation and verified content catalogue

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `app/layout.tsx`, `app/globals.css`
- Create: `lib/content.mjs`, `tests/content.test.mjs`

**Interfaces:**
- Produces `guides`, `guideBySlug(slug)`, and `site` from `lib/content.mjs`.
- `Guide` contains `slug`, `kind`, `title`, `h1`, `description`, `category`, `area`, `hint`, `lastVerified`, `updated`, `readTime`, `imageAlt`, `assetRequirement`, and `relatedSlugs`.

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { guides, guideBySlug } from '../lib/content.mjs';

test('the catalogue exposes the three puzzles and map-room walkthrough', () => {
  assert.equal(guides.length, 4);
  assert.equal(guideBySlug('puzzles/green-chair-headphones').h1, 'Green Chair and Headphones Puzzle: Solved');
  assert.equal(guideBySlug('missing'), undefined);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/content.test.mjs`

Expected: FAIL because `lib/content.mjs` does not exist.

- [ ] **Step 3: Implement the project foundation and minimal catalogue**

Create a Next 14 root project with a `test` script that runs `node --test`. Add the four approved records using their exact supplied metadata and only the generic, non-answer hints: inspect nearby visual clues; keep the item or number context in view; revisit the immediately visible objective area. `guideBySlug` returns the matching record or `undefined`.

- [ ] **Step 4: Run the catalogue test to verify it passes**

Run: `npm test`

Expected: PASS with one test and no failures.

### Task 2: Shared server-rendered guide system

**Files:**
- Create: `components/site.tsx`, `components/guides.tsx`, `components/json-ld.tsx`
- Create: `app/puzzles/[...slug]/page.tsx`, `app/walkthrough/[...slug]/page.tsx`

**Interfaces:**
- Consumes `guides`, `guideBySlug`, and `site` from `lib/content.mjs`.
- Produces routes with static `generateStaticParams`, per-route metadata, Article/BreadcrumbList JSON-LD, and `noindex, follow` robots metadata.

- [ ] **Step 1: Write the failing route-content test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { guides } from '../lib/content.mjs';

test('every first-release detail page declares an image hand-off requirement', () => {
  assert.ok(guides.every((guide) => guide.assetRequirement.includes('.webp')));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/content.test.mjs`

Expected: FAIL because the records do not yet contain `assetRequirement`.

- [ ] **Step 3: Implement the shared components and static detail templates**

Render the breadcrumb, exact H1, metadata row, HTML hint block, verification panel, related approved links, desktop-only table of contents, and footer. The verification panel must state that the final solution and annotated screenshot will be published after first-hand verification, include the required WebP filename and natural alt text, and not contain a fictional solution. Encode cross-links among the three puzzle records and a home link for the map-room walkthrough. Implement `Article` and `BreadcrumbList` schema.

- [ ] **Step 4: Run the route-content test to verify it passes**

Run: `npm test`

Expected: PASS with all tests and no failures.

### Task 3: Homepage, puzzle directory, discoverability, and visual system

**Files:**
- Create: `app/page.tsx`, `app/puzzles/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `public/placeholder-guide-image.svg`
- Modify: `app/globals.css`, `components/site.tsx`, `components/guides.tsx`

**Interfaces:**
- Consumes the shared content model and visual components.
- Produces the root and directory pages with indexable metadata, site navigation, static card discovery, and generated sitemap/robots.

- [ ] **Step 1: Write the failing metadata safety test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { guides } from '../lib/content.mjs';

test('verified-image placeholders use lowercase keyword filenames', () => {
  assert.ok(guides.every((guide) => /^[a-z0-9-]+\.webp$/.test(guide.assetRequirement)));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/content.test.mjs`

Expected: FAIL until Task 2 uses the approved lower-case WebP filenames.

- [ ] **Step 3: Implement indexable discovery pages and final styling**

Build the documented home sequence: sunset Hero, static search treatment, popular internal links, four browse category cards for tower, area, item, and achievement, the four P0 guide cards, and forest-tint “How it works” band. Build the directory grouped by tower. Add the responsive warm-paper editorial CSS, SVG line icons, focus states, and 44px controls. The sitemap includes only `/` and `/puzzles/`; robots allows crawling while detail pages declare `noindex` at the page level.

- [ ] **Step 4: Run all content tests to verify they pass**

Run: `npm test`

Expected: PASS with all tests and no failures.

### Task 4: Production verification

**Files:**
- Modify only if verification finds a task-related issue.

- [ ] **Step 1: Run static type verification**

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: exit code 0 and all six requested routes appear as statically generated or prerendered routes.

- [ ] **Step 3: Serve the production build and inspect routes**

Run: `npm run start -- -p 3110`

Expected: `/`, `/puzzles/`, the three puzzle routes, and `/walkthrough/red-tower-map-room/` return 200.

## Plan self-review

- Spec coverage: Tasks 1–3 cover every supplied first-release route, content boundary, metadata, schema, visual token, internal-link, and responsive requirement; Task 4 verifies the output.
- Placeholder scan: no implementation work is left unspecified; explicit verification-status content is intentional product behavior.
- Consistency: `Guide.assetRequirement` is added in Task 2 before the filename safety test in Task 3, so the test cycle is red then green.

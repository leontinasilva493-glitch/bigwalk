# Navigation and Entry Points Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every completed or evidence-gated Big Walk topic a truthful, intent-led entry point without mixing puzzle answers with route walkthroughs.

**Architecture:** Keep the existing server-rendered App Router pages and evidence gate. The shared header owns the primary and secondary navigation; the puzzle directory filters `guides` by `kind`; the walkthrough hub renders the route records it owns. Homepage cards become real links to these hubs rather than a read-only search affordance.

**Tech Stack:** Next.js 16 App Router, React Server Components, TypeScript, Node test runner.

## Global Constraints

- Keep unverified topic pages `noindex, follow` and out of the sitemap.
- Keep purple-things unindexed while reports conflict.
- Do not add a green-platform route without independent evidence.
- Do not copy third-party video frames or screenshots.
- Do not commit or push; the user requested a completion prompt before GitHub submission.

---

### Task 1: Intent-led shared navigation

**Files:**
- Modify: `components/site.tsx`
- Modify: `app/globals.css`
- Test: `tests/v3-information-architecture.test.mjs`

**Interfaces:**
- Produces `SiteHeader(active)` links for `puzzles`, `walkthrough`, `beginner`, `multiplayer`, and `help`; secondary links for achievements and purple challenges.
- Consumers pass the existing active key to `SiteHeader`.

- [x] **Step 1: Write the failing navigation contract test**

Add assertions that the header exposes `/walkthrough` and `/troubleshooting` as primary destinations, and keeps `/achievements` and `/puzzles/purple-challenges` in a secondary navigation group.

- [x] **Step 2: Run the focused test to verify RED**

Run: `node --test tests/v3-information-architecture.test.mjs`

Expected: FAIL because `/walkthrough` and `/troubleshooting` are absent from the current primary navigation.

- [x] **Step 3: Implement the header and responsive secondary menu**

Replace the current four-item primary list with Puzzles, Walkthroughs, Beginner Guide, Multiplayer, and Help & Fixes. Add a semantic `details` menu named `More guides` containing Achievements and Purple Challenges; expose those same destinations in the mobile panel.

- [x] **Step 4: Run the focused test to verify GREEN**

Run: `node --test tests/v3-information-architecture.test.mjs`

Expected: PASS.

### Task 2: Separate puzzle and walkthrough directories

**Files:**
- Modify: `app/puzzles/page.tsx`
- Modify: `components/evidence-page.tsx`
- Modify: `app/walkthrough/page.tsx`
- Modify: `app/walkthrough/[...slug]/page.tsx`
- Test: `tests/discovery-pages.test.mjs`
- Test: `tests/detail-template.test.mjs`

**Interfaces:**
- `/puzzles` renders only `guide.kind === 'puzzle'` records.
- `/walkthrough` renders its `guide.kind === 'walkthrough'` records as actual route cards.
- Red Tower walkthrough pages mark `walkthrough` active in the header.

- [x] **Step 1: Write failing directory contract tests**

Assert that the puzzle directory derives `puzzleGuides` from `guide.kind === 'puzzle'`, that the walkthrough hub derives `walkthroughGuides` from `guide.kind === 'walkthrough'`, and that the Red Tower page activates walkthrough navigation.

- [x] **Step 2: Run the focused tests to verify RED**

Run: `node --test tests/discovery-pages.test.mjs tests/detail-template.test.mjs`

Expected: FAIL because the current directory renders all guide records and the walkthrough header is not active.

- [x] **Step 3: Implement filtered cards and route-hub cards**

Filter puzzle cards before grouping by tower. Extend `EvidencePage` with an optional `featuredGuides` collection and render a visible “Available routes” section when passed by `/walkthrough`; pass walkthrough records from the route page. Set the Red Tower detail header to `active="walkthrough"`.

- [x] **Step 4: Run focused tests to verify GREEN**

Run: `node --test tests/discovery-pages.test.mjs tests/detail-template.test.mjs`

Expected: PASS.

### Task 3: Make homepage discovery controls navigable

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/guides.tsx`
- Modify: `app/globals.css`
- Test: `tests/discovery-pages.test.mjs`

**Interfaces:**
- `CategoryCard` accepts `href: string` and renders an internal Next Link.
- Homepage presents `Find a puzzle` and `Browse unlock routes` actions, not a read-only search input.
- Category cards route visitors to puzzle, walkthrough, achievements, or visual-clue sections.

- [x] **Step 1: Write the failing homepage-entry test**

Assert for literal user-visible links to `/puzzles` and `/walkthrough`, an `href` property on `CategoryCard`, and removal of the `readOnly` search input.

- [x] **Step 2: Run the focused test to verify RED**

Run: `node --test tests/discovery-pages.test.mjs`

Expected: FAIL because the homepage still has a non-functional visual search prompt and cards without links.

- [x] **Step 3: Implement minimal link-based entry points**

Replace the visual search affordance with a compact “Choose a path” action group. Add href values for all category cards and make the full cards Link components. Keep the existing visual finder as a destination for item/visual clue browsing.

- [x] **Step 4: Run the focused test to verify GREEN**

Run: `node --test tests/discovery-pages.test.mjs`

Expected: PASS.

### Task 4: Verify SEO language and release candidate

**Files:**
- Modify: `app/layout.tsx`
- Test: `tests/metadata-seo.test.mjs`

**Interfaces:**
- Root default metadata describes source-checked solutions and later original captures, matching the homepage wording.

- [x] **Step 1: Write the failing metadata consistency test**

Assert that `app/layout.tsx` includes `Source-checked` and `original marked screenshots are added after local capture` in the root description.

- [x] **Step 2: Run the focused test to verify RED**

Run: `node --test tests/metadata-seo.test.mjs`

Expected: FAIL because the root layout still calls all solutions “Verified”.

- [x] **Step 3: Align the root metadata wording**

Use the same source-checked/local-capture distinction in the root title description, Open Graph description, and Twitter description.

- [x] **Step 4: Run full verification**

Run: `npm.cmd test`; `npm.cmd run typecheck`; `npm.cmd run build`

Expected: all commands exit 0. Start `next start` on an unused local port and verify the five navigation destinations, Red Tower page, sitemap, and robots output return HTTP 200.

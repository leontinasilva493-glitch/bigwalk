# Crosswalk Opening Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an original, source-checked Crosswalk opening-route guide at `/walkthrough/crosswalk`, expose it from the Walkthroughs hub, and make it eligible for Google discovery.

**Architecture:** Add one walkthrough record to the existing `lib/content.mjs` catalogue so static params, metadata, hub cards, and sitemap inclusion remain data-driven. Extend the shared guide renderer with optional route-overview and failure-recovery sections that future route pages can reuse, while keeping detailed spoilers inside the existing disclosure component.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, TypeScript, Node test runner, generated metadata and sitemap file conventions.

## Global Constraints

- Canonical route is exactly `/walkthrough/crosswalk`.
- The route belongs under the existing `Walkthroughs` navigation destination.
- Publish original wording; do not reproduce third-party prose, captions, images, or page layout pixel-for-pixel.
- Use `status: published`, `evidenceLevel: corroborated`, and `indexable: true` with a visible source-checked disclosure.
- Do not create individual crane, telescope, symbol-house, scaffold, ending, or secret-ending URLs in this release.
- Do not add dependencies or modify the global visual direction.
- Preserve the two unrelated untracked Cloudflare documents.

---

### Task 1: Crosswalk route catalogue contract

**Files:**
- Modify: `tests/content.test.mjs`
- Modify: `lib/content.mjs`

**Interfaces:**
- Consumes: `guides`, `guideBySlug(slug)`, and the existing guide-record schema.
- Produces: `guideBySlug('walkthrough/crosswalk')` with route overview, source provenance, generic solution stages, failure recovery, related routes, and indexable state.

- [x] **Step 1: Write the failing catalogue test**

Add assertions that the catalogue contains five guides and that the Crosswalk record has:

```js
const crosswalk = guideBySlug('walkthrough/crosswalk');

assert.equal(crosswalk.kind, 'walkthrough');
assert.equal(crosswalk.indexable, true);
assert.equal(crosswalk.status, 'published');
assert.equal(crosswalk.evidenceLevel, 'corroborated');
assert.equal(crosswalk.sourceCheckedAt, '2026-08-09');
assert.ok(crosswalk.routeSummary.length >= 5);
assert.ok(crosswalk.solutionSteps.length >= 6);
assert.ok(crosswalk.commonFailures.length >= 4);
assert.ok(crosswalk.sources.length >= 2);
assert.deepEqual(crosswalk.relatedSlugs, [
  'walkthrough/red-tower-map-room',
  'puzzles',
]);
```

Update the exact source-checked slug and tower arrays to include `walkthrough/crosswalk` and `Opening area`.

- [x] **Step 2: Run the catalogue test to verify RED**

Run: `node --test tests/content.test.mjs`

Expected: FAIL because `guideBySlug('walkthrough/crosswalk')` is undefined and the catalogue still contains four guides.

- [x] **Step 3: Add the original Crosswalk record**

Add one `kind: 'walkthrough'` record with:

```js
{
  slug: 'walkthrough/crosswalk',
  kind: 'walkthrough',
  title: 'How to Unlock the Crosswalk in Big Walk',
  h1: 'Big Walk Crosswalk Walkthrough: Opening Route',
  verificationStatus: 'source_checked',
  verificationLabel: 'Source-checked opening route',
  status: 'published',
  evidenceLevel: 'corroborated',
  indexable: true,
  category: 'opening route',
  tower: 'Opening area',
  area: 'Crosswalk',
  sourceCheckedAt: '2026-08-09',
  updated: '2026-08-09',
  relatedSlugs: ['walkthrough/red-tower-map-room', 'puzzles'],
}
```

Use the following original route content in the record:

```js
description: 'Unlock the Big Walk Crosswalk with a spoiler-conscious opening route: clear four co-op challenges, return their rewards, resize the gold key, and lower the first bridge.',
aliases: ['crosswalk', 'unlock crosswalk', 'opening bridge', 'first bridge'],
visualCues: ['raised red drawbridge', 'beach control platform', 'gold key', 'four covered reward slots'],
nearbyLandmarks: ['tutorial beach', 'customisation structure', 'first mountain slope'],
goal: 'Complete the four challenges available before the raised Crosswalk, load their rewards into the beach control, resize the gold key, and use it at the bridge lock.',
routeSummary: [
  'Inspect the beach-side control platform',
  'Clear the four nearby co-op challenges',
  'Return all four red rewards to the control',
  'Release and resize the gold key',
  'Use the finished key at the Crosswalk lock',
],
solutionSteps: [
  { title: 'Read the beach control before splitting up', body: 'Use the four covered slots and oversized key as the group checklist. Stay on the tutorial side of the raised bridge until every nearby reward has been returned.' },
  { title: 'Reach the high crane control together', body: 'Look for the yellow crane near the opening slope. Build enough height with your group for the upper player to use the raised control, then collect the reward that appears.' },
  { title: 'Split the telescope job into holder and runner', body: 'Leave one player at the viewing platform to maintain the active control while a second player follows the indicated line toward the remote objective. Keep the control held until the runner confirms the pickup.' },
  { title: 'Describe the symbol sequence instead of guessing it', body: 'At the small blue structure, place one reader inside and one builder outside. Read the active displays in order and reproduce that order with the available pieces; treat any visible sample as session-specific.' },
  { title: 'Coordinate the scaffold controls with one countdown', body: 'Assign players to the active controls shown by the current world. Use a short countdown and restart cleanly if the inputs do not register instead of pressing at random.' },
  { title: 'Return the rewards and release the oversized key', body: 'Bring every red reward back to the beach control and use the matching panel interactions to load the slots. Take the gold key only after the control has accepted the full set.' },
  { title: 'Follow each cutter handoff to the bridge lock', body: 'The first key is too large for the Crosswalk. Use the nearby cutter, read the direction shown after each cut, and follow that handoff until the key fits the grey lock beside the raised bridge.' },
],
commonFailures: [
  { problem: 'A challenge gives no reward', fix: 'Repeat that interaction with clearly assigned roles and confirm the active player, control, or order before leaving the landmark.' },
  { problem: 'The remote objective closes', fix: 'Send the holder back to the telescope-side control and keep it active until the runner confirms the pickup.' },
  { problem: 'The symbol submission is rejected', fix: 'Recheck the current displays from first to last and correct the first mismatch; do not reuse a sequence from another session.' },
  { problem: 'The scaffold controls do not register', fix: 'Return everyone to their active station, agree on one countdown, and shorten the interval between inputs.' },
  { problem: 'The group loses the key route', fix: 'Return to the last cutter used and wait for its direction indicator to settle before moving on.' },
],
sources: [
  { title: 'Big Walk Crosswalk Puzzles — Opening Solutions', publisher: 'Big Walk Wiki', url: 'https://big-walkwiki.wiki/puzzles/crosswalk' },
  { title: 'Big Walk FAQ', publisher: 'House House', url: 'https://bigwalk.game/faq/' },
],
```

The screenshot checklist must request three original captures: the opening control and raised bridge, one representative co-op challenge, and the finished key at the Crosswalk lock.

- [x] **Step 4: Run the catalogue test to verify GREEN**

Run: `node --test tests/content.test.mjs`

Expected: PASS.

- [x] **Step 5: Commit the catalogue unit**

```powershell
git add -- tests/content.test.mjs lib/content.mjs
git commit -m "feat(content): add crosswalk opening route"
```

### Task 2: Reusable route overview and recovery UI

**Files:**
- Modify: `tests/detail-template.test.mjs`
- Modify: `components/guides.tsx`
- Modify: `app/walkthrough/[...slug]/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: optional `guide.routeSummary: string[]`, `guide.goal: string`, and `guide.commonFailures: Array<{ problem: string; fix: string }>`.
- Produces: `RouteOverview({ guide })`, visible quick-answer and progress checklist markup, and a reusable recovery table rendered only when failures exist.

- [x] **Step 1: Write the failing template tests**

Assert that the walkthrough page imports and renders `RouteOverview` before `HintBlock`, and that `components/guides.tsx` contains the user-visible labels `Quick answer`, `Route at a glance`, `If the route stalls`, `Problem`, and `What to do`.

- [x] **Step 2: Run the template test to verify RED**

Run: `node --test tests/detail-template.test.mjs`

Expected: FAIL because no route-overview component or failure table exists.

- [x] **Step 3: Implement `RouteOverview` and recovery rendering**

In `components/guides.tsx`, add a server component that checks `'routeSummary' in guide`, renders `guide.goal` as the direct answer, and renders each route stage in an ordered checklist. Extend `VerificationPanel` to render a semantic table after the spoiler disclosure when `guide.commonFailures.length > 0`:

```tsx
<table>
  <thead><tr><th>Problem</th><th>What to do</th></tr></thead>
  <tbody>
    {guide.commonFailures.map((failure) => (
      <tr key={failure.problem}>
        <th scope="row">{failure.problem}</th>
        <td>{failure.fix}</td>
      </tr>
    ))}
  </tbody>
</table>
```

Render `<RouteOverview guide={guide} />` between the hero/toc and `HintBlock` in the walkthrough detail page. Add scoped responsive styles for the checklist and horizontally scrollable table without altering unrelated page styling.

- [x] **Step 4: Run the template test to verify GREEN**

Run: `node --test tests/detail-template.test.mjs`

Expected: PASS.

- [x] **Step 5: Commit the presentation unit**

```powershell
git add -- tests/detail-template.test.mjs components/guides.tsx app/walkthrough/[...slug]/page.tsx app/globals.css
git commit -m "feat(walkthrough): render route overview and recovery"
```

### Task 3: Discovery, SEO, and production verification

**Files:**
- Modify: `tests/discovery-pages.test.mjs`
- Modify: `tests/metadata-seo.test.mjs`
- Verify: `app/walkthrough/page.tsx`
- Verify: `app/walkthrough/[...slug]/page.tsx`
- Verify: `app/sitemap.ts`

**Interfaces:**
- Consumes: the new indexable guide record and existing data-driven hub, metadata, static params, and sitemap filters.
- Produces: a Walkthroughs hub card, static route, self-canonical metadata with `index, follow`, and a sitemap entry for `/walkthrough/crosswalk`.

- [x] **Step 1: Add discovery and metadata contract tests**

Assert that:

```js
assert.ok(guides.filter((guide) => guide.kind === 'walkthrough')
  .some((guide) => guide.slug === 'walkthrough/crosswalk'));
assert.ok(guides.filter((guide) => guide.indexable)
  .some((guide) => guide.slug === 'walkthrough/crosswalk'));
```

Keep the existing source checks that prove the Walkthroughs hub derives its cards from walkthrough records, the detail route derives `robots.index` from `guide.indexable`, and the sitemap derives URLs from indexable guide records.

- [x] **Step 2: Run focused SEO and discovery tests**

Run: `node --test tests/content.test.mjs tests/detail-template.test.mjs tests/discovery-pages.test.mjs tests/metadata-seo.test.mjs`

Expected: PASS without hard-coding the Crosswalk URL into `app/sitemap.ts` or duplicating a dedicated route file.

- [x] **Step 3: Run full verification**

Run:

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
```

Expected: every command exits 0 and the build output includes `/walkthrough/crosswalk` as a prerendered route.

- [x] **Step 4: Inspect the production build**

Start `npm.cmd run start -- --hostname 127.0.0.1 --port 3111`, then verify:

```text
GET /walkthrough/crosswalk -> 200
canonical -> https://bigwalkwalkthrough.com/walkthrough/crosswalk
robots -> index, follow
GET /walkthrough -> contains the Crosswalk card
GET /sitemap.xml -> contains /walkthrough/crosswalk
```

Also confirm the page contains one H1, source links, the quick answer, route checklist, spoiler disclosure, failure table, and no third-party image URL.

- [x] **Step 5: Run final repository checks**

Run: `git diff --check`; `git status --short`

Expected: no whitespace errors; the implementation plan is the only task-related uncommitted file, while the unrelated Cloudflare documents remain untouched.

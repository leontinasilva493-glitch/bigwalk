# Big Walk Community Gameplay Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add and enrich the approved gameplay-guide pages in three ordered batches, then provide a verified local production preview.

**Architecture:** Add three guide records in `lib/gameplay-demand-content.mjs` and reuse the existing static puzzle detail template. Extend existing data/components only for reusable access, identification, coordinate, locator-image, and anchor behaviors.

**Tech Stack:** Next.js 16.3 App Router, React 19.2, TypeScript 5.8, global CSS, SVG, Node test runner.

**Spec:** `docs/superpowers/specs/2026-08-25-community-gameplay-guides-design.md`

## Global Constraints

- Execute Batch 1, then Batch 2, then Batch 3.
- Preserve unrelated dirty-worktree changes.
- Do not introduce dependencies or client-side JavaScript.
- Keep community labels and world-size uncertainty visible.
- Do not merge Four-Piece into Forget-Me-Not or Black Sphere into Black Tower/True Ending.

---

### Task 1: Batch 1 — Four-Piece, Heavy Ball, and Purple access

**Files:**
- Create: `tests/community-gameplay-guides.test.mjs`
- Create: `lib/gameplay-demand-content.mjs`
- Modify: `lib/content.mjs`
- Modify: `components/evidence-page.tsx`
- Modify: `lib/sitemap-content.mjs`

**Interfaces:**
- Produces: `fourPieceGuide`, `heavyBallGuide`, and `siteSection.accessRoute`.

- [ ] Add failing assertions for two unique published puzzle records, complete source/solution/recovery contracts, Purple Challenge access checkpoints, and P0 sitemap ordering.
- [ ] Run the focused test and confirm failures are caused by missing records/access fields.
- [ ] Implement the two guide records, Purple access block, related links, and sitemap ownership.
- [ ] Re-run the focused test and existing Purple/sitemap tests.

### Task 2: Batch 2 — Black Sphere, puzzle identifier, and Radio clarification

**Files:**
- Modify: `tests/community-gameplay-guides.test.mjs`
- Modify: `lib/gameplay-demand-content.mjs`
- Modify: `lib/content.mjs`
- Modify: `app/puzzles/page.tsx`
- Modify: `components/guides.tsx`
- Modify: `lib/sitemap-content.mjs`

**Interfaces:**
- Produces: `blackSphereGuide`, a puzzle-vs-landmark decision section, and `guide.routeNotice` rendering.

- [ ] Add failing assertions for the Black Sphere route boundary, corroborated room archetypes, puzzle identifier decisions, Radio “not a puzzle” answer, and P1 sitemap entry.
- [ ] Run the focused test and confirm the expected missing behavior.
- [ ] Implement the guide, identifier, radio notice, and cross-links.
- [ ] Re-run the focused test plus detail/directory tests.

### Task 3: Batch 3 — Coordinates, original pegboard locator, and achievement anchors

**Files:**
- Modify: `tests/community-gameplay-guides.test.mjs`
- Modify: `lib/content.mjs`
- Modify: `lib/demand-guide-content.mjs`
- Modify: `components/guides.tsx`
- Modify: `app/puzzles/[...slug]/page.tsx`
- Create: `public/images/editorial/colored-pegboard-search-zones.svg`
- Modify: `app/achievements/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `guide.coordinateMechanic`, `guide.locatorImage`, reusable locator rendering, and stable trophy anchor navigation.

- [ ] Add failing assertions for coordinate-box flow, SVG search-zone disclaimer, locator rendering, and direct trophy jump links.
- [ ] Run the focused test and confirm the expected failures.
- [ ] Implement the mechanic block, original SVG, responsive locator component/styles, and achievement jump navigation.
- [ ] Re-run the focused test plus coordinates, pegboard, metadata, and achievement tests.

### Task 4: Full verification and local review

**Files:**
- Verify only except for task-related fixes found by checks.

**Interfaces:**
- Produces: a local production server and review URL list.

- [ ] Run `npm.cmd test`, `npm.cmd run typecheck`, and `npm.cmd run build`.
- [ ] Start the production server on an available localhost port.
- [ ] Verify every changed route over HTTP, including canonical, robots, and sitemap inclusion.
- [ ] Use Tabbit to inspect the new and enriched pages at desktop and mobile widths.
- [ ] Report the local links and verification evidence without committing, pushing, or deploying.

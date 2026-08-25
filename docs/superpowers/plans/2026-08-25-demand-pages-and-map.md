# Big Walk Demand Pages and Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved P0 demand pages and a functional `/map` explorer, then verify every route locally.

**Architecture:** Keep source-backed page data in focused `lib/*-content.mjs` modules, use Server Components for crawlable content, and isolate map interactivity in `components/map-explorer.tsx`. Existing guide records continue to drive puzzle/walkthrough detail routes and sitemap filtering.

**Tech Stack:** Next.js 16.3 App Router, React 19.2, TypeScript 5.8, global CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-08-25-demand-pages-and-map-design.md`

## Global Constraints

- Preserve existing uncommitted homepage, related-games, CSS, and test changes.
- Use official House House/Panic sources first and label forum observations.
- Keep gameplay uncertainty visible; do not invent puzzle coordinates or official names.
- Use no new runtime dependencies.
- Use Server Components by default and one narrow Client Component for map state.

---

### Task 1: Demand-page contracts

**Files:**
- Create: `tests/demand-pages-2026.test.mjs`
- Modify: `lib/content.mjs`
- Create: `lib/updates-content.mjs`
- Create: `app/patch-notes/page.tsx`

**Interfaces:**
- Produces: `updates`, `currentVersion`, and complete `Guide` records for `walkthrough/black-tower` and `puzzles/colored-pegboard`.

- [ ] Write tests asserting URL ownership, source counts, version 1.4.10, index state, and the Forget-Me-Not alias split.
- [ ] Run `node --test tests/demand-pages-2026.test.mjs` and confirm failures are caused by missing records/files.
- [ ] Add the minimal data and page implementation.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Purple, ending, and trophy enrichment

**Files:**
- Modify: `lib/content.mjs`
- Modify: `components/evidence-page.tsx`
- Modify: `app/achievements/page.tsx`
- Test: `tests/demand-pages-2026.test.mjs`

**Interfaces:**
- Produces: purple challenge quick answer/checklist fields, an indexable current-version True Ending guide, and a trophy roadmap.

- [ ] Add failing assertions for purple reward ownership, White Key route, host-save warning, and trophy roadmap sections.
- [ ] Run the focused test and confirm expected failures.
- [ ] Implement source-labelled enrichment without splitting duplicate URLs.
- [ ] Re-run the focused test and existing achievement/purple tests.

### Task 3: Functional map explorer

**Files:**
- Create: `lib/map-content.mjs`
- Create: `components/map-explorer.tsx`
- Create: `app/map/page.tsx`
- Modify: `app/globals.css`
- Create: `tests/map-product.test.mjs`

**Interfaces:**
- Consumes: serializable `mapPoints` objects.
- Produces: `MapExplorer({ points })` with search, filters, spoiler toggle, selected marker, and versioned local completion state.

- [ ] Write tests for unique IDs, valid normalized coordinates, working internal URLs, spoiler flags, control labels, and metadata.
- [ ] Run the map test and confirm missing-module/page failures.
- [ ] Implement the data, server page, client explorer, and responsive styles.
- [ ] Re-run the focused map test and typecheck.

### Task 4: Discovery, sitemap, and verification

**Files:**
- Modify: `components/site.tsx`
- Modify: `app/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: relevant tests under `tests/`

**Interfaces:**
- Consumes: the new routes and current-version content.
- Produces: hub/header/footer discovery and sitemap coverage.

- [ ] Add failing discovery and sitemap assertions for `/map`, `/patch-notes`, Black Tower, Colored Pegboard, and True Ending.
- [ ] Run focused tests and confirm expected failures.
- [ ] Add internal links and sitemap discovery while preserving existing dirty-worktree additions.
- [ ] Run `npm.cmd test`, `npm.cmd run typecheck`, and `npm.cmd run build`.
- [ ] Start the production server and verify HTTP, canonical, robots, content, map controls, and mobile/desktop rendering for every changed route.

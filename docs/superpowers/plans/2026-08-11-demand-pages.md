# Demand Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add evidence-gated true-ending and peg-puzzle landing pages, complete the indexed achievements guide, and turn three troubleshooting placeholders into useful symptom-specific research pages.

**Architecture:** Reuse the existing dynamic puzzle and walkthrough templates by adding two complete guide records to `lib/content.mjs`. Keep both new demand pages `noindex, follow` until original current-version captures complete the promotion gate. Add a small troubleshooting content model and shared article component for the three existing static routes, while keeping community-only fixes visibly unverified and outside the sitemap.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 5.8, Node test runner.

## Global Constraints

- Preserve the current evidence labels and `indexable`-driven sitemap behavior.
- Do not copy third-party screenshots or present community workarounds as official fixes.
- Keep `walkthrough/true-ending`, `puzzles/peg-puzzle`, and troubleshooting child pages `noindex, follow` until current first-hand evidence is captured.
- Reuse existing dynamic templates, cards, metadata, JSON-LD, and internal-link conventions.
- Preserve unrelated untracked files.

---

### Task 1: Demand-page catalogue contracts

**Files:**
- Create: `tests/demand-pages.test.mjs`
- Modify: `tests/content.test.mjs`

**Interfaces:**
- Consumes: `guideBySlug()`, `guides`, `homepageFeaturedGuideSlugs`
- Produces: failing contracts for two complete, non-indexable guide records and their discovery links

- [ ] Write tests requiring `walkthrough/true-ending` and `puzzles/peg-puzzle`, complete evidence/source/capture fields, `indexable: false`, unique aliases, and directory/home discovery.
- [ ] Run `npm.cmd test -- tests/demand-pages.test.mjs` and verify failure because the records do not exist.
- [ ] Add the two guide records and related links in `lib/content.mjs`; update green-room planned-link text, homepage features, and hub relationships.
- [ ] Run the targeted tests and verify they pass.

### Task 2: Indexed achievements completeness

**Files:**
- Modify: `tests/demand-pages.test.mjs`
- Modify: `app/achievements/page.tsx`

**Interfaces:**
- Consumes: new `/walkthrough/true-ending` route
- Produces: an indexed achievements page with no visible placeholders and explicit routes for all 13 trophies

- [ ] Add a failing test that rejects bracketed placeholders and requires Big Help, Big Climb, Big Makeover, Big Goodbye, and Big Game to have concrete areas and guidance.
- [ ] Run the targeted test and verify the current `[to verify]` values fail it.
- [ ] Replace placeholder fields with source-checked high-level guidance; link Big Goodbye and Big Game to the true-ending page and add a post-game handoff section.
- [ ] Run the targeted test and verify it passes.

### Task 3: Symptom-specific troubleshooting pages

**Files:**
- Create: `lib/troubleshooting-content.mjs`
- Create: `components/troubleshooting-guide.tsx`
- Modify: `app/troubleshooting/cant-rejoin-after-disconnect/page.tsx`
- Modify: `app/troubleshooting/voice-chat-not-working/page.tsx`
- Modify: `app/troubleshooting/white-screen-and-crash/page.tsx`
- Modify: `app/troubleshooting/page.tsx`
- Modify: `tests/demand-pages.test.mjs`

**Interfaces:**
- Produces: `troubleshootingBySlug(slug)` records with `quickChecks`, `diagnostics`, `sources`, `evidenceNeeds`, and `indexable: false`
- Consumes: shared `TroubleshootingGuide` and `troubleshootingMetadata`

- [ ] Add failing tests for the three records, source-labelled steps, version stamps, canonical/noindex metadata, and the hub symptom router.
- [ ] Run the targeted test and verify failure because the model/component do not exist.
- [ ] Implement the model and shared article; convert the three static routes to it and enrich the hub with the three symptom cards.
- [ ] Run the targeted test and verify it passes.

### Task 4: Discovery and presentation integration

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/puzzles/page.tsx`
- Modify: `app/walkthrough/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/demand-pages.test.mjs`

**Interfaces:**
- Consumes: guide catalogue and troubleshooting records
- Produces: visible cards/links without adding noindex pages to the sitemap

- [ ] Add failing assertions for homepage, puzzle directory, walkthrough route center, achievements, and troubleshooting links.
- [ ] Add the smallest matching cards/sections and responsive styling using existing design tokens.
- [ ] Run the targeted test and the existing discovery/metadata tests.

### Task 5: Full verification and local review server

**Files:**
- Verify only; no additional production scope.

- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run typecheck`.
- [ ] Run `npm.cmd run build`.
- [ ] Start the production server on a free localhost port with a hidden process.
- [ ] Verify each changed URL returns 200 and the new/noindex routes emit `noindex, follow` while `/achievements` remains `index, follow`.
- [ ] Report the exact local review links and modified page list.

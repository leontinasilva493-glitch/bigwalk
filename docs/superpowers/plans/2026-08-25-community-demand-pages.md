# Big Walk Community Demand Pages Implementation Plan

**Goal:** Turn the newest Steam and Reddit support demand into safer, source-bounded troubleshooting pages without duplicating existing guide intent.

**Architecture:** Keep troubleshooting records in `lib/troubleshooting-content.mjs`, render them through the existing server-component template, and give only the new symptom a thin route wrapper. Preserve `noindex, follow` for unresolved fixes. Refresh the existing LFG page in place because it already owns player-finding intent.

**Tech Stack:** Next.js 16 App Router, React 19 server components, Node test runner.

---

### Task 1: Lock the current demand contract with failing tests

**Files:**
- Modify: `tests/troubleshooting-pages.test.mjs`

1. Add `save-corrupted-or-missing` to the expected troubleshooting records and route checks.
2. Assert that reconnect guidance names version 1.4.10, preserves exact error text, and distinguishes official fixes from community experiments.
3. Assert that crash guidance separates startup white screen from in-session performance degradation.
4. Assert that save recovery begins with a backup and does not claim that Windows Previous Versions always works.
5. Run the targeted test and confirm it fails because the new record and route do not exist.

### Task 2: Implement the P0/P1 troubleshooting content

**Files:**
- Modify: `lib/troubleshooting-content.mjs`
- Modify: `components/troubleshooting-guide.tsx`
- Add: `app/troubleshooting/save-corrupted-or-missing/page.tsx`
- Modify: `lib/content.mjs`

1. Update the reconnect page with the official 1.4.10 fixes and current Steam/Reddit evidence.
2. Update the crash page with separate launch, join, progressive frame-drop, and hard-lock paths.
3. Add the source-bounded save-corruption record and route; keep it `noindex, follow`.
4. Make the template evidence-boundary copy derive from the record rather than hard-code a page count or unsupported status.
5. Add the new symptom to troubleshooting hub relationships.
6. Run the targeted test and confirm it passes.

### Task 3: Refresh the existing LFG page instead of creating a duplicate

**Files:**
- Modify: `app/multiplayer/how-to-find-players/page.tsx`
- Modify: `tests/lfg-page.test.mjs`

1. Add a failing test for the current 23 August megathread and community-link safety note.
2. Replace the stale dated Reddit link and last-checked date.
3. Remove the hard-coded public Discord invite because the current subreddit explicitly disallows public server links and Steam users report invite scams.
4. Add host/version/password fields to the posting template to reduce failed joins.
5. Run the targeted test and confirm red then green.

### Task 4: Verify the integrated result

**Files:**
- Verify only.

1. Run the troubleshooting and LFG tests.
2. Run the full Node test suite.
3. Run `npm.cmd run typecheck` and `npm.cmd run build`.
4. Confirm the new route is prerendered and remains absent from the sitemap while `noindex`.
5. Inspect the final diff without touching unrelated user changes.

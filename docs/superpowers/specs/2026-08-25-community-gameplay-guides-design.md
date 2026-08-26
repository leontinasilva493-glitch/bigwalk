# Big Walk Community Gameplay Guides Design

## Goal

Turn current puzzle-specific Steam and Reddit demand into three new source-checked puzzle pages and bounded enrichments of the existing Purple Challenges, puzzle directory, Radio Channels, coordinates, Colored Pegboard, and achievements pages.

## URL ownership

- `/puzzles/blue-platform-four-piece` owns the blue stairs / weather balloon / Moon-on-a-Stick / four placards / four inserts puzzle. It must explicitly disambiguate itself from Forget-Me-Not.
- `/puzzles/heavy-ball` owns both “purple heavy ball” and “bowling ball” route intent, with the train + chairlift route and the shorter mountain-pass route labelled by source.
- `/puzzles/black-sphere` owns the silent Black Sphere room sequence and Big Goodbye handoff. Black Tower continues to own the Black Key and Wall route; True Ending continues to own post-game completion and the White Key.
- `/puzzles/purple-challenges` remains the seven-challenge hub and gains an answer-first access route.
- `/puzzles` owns puzzle-vs-landmark identification; `/walkthrough/radio-channels` owns the clarification that listening stations are not reward puzzles.
- `/puzzles/4166-1899-coordinates` gains the reusable coordinate-box mechanic without becoming an “all coordinates” thin hub.
- `/puzzles/colored-pegboard` gains an original search-zone diagram labelled as schematic, not exact spawn data.
- `/achievements` keeps one canonical trophy page and gains shareable jump links to high-demand trophy anchors.

## Evidence and indexing

The three new pages are source-checked community guides: every route or mechanic is supported by at least two current sources, community names remain labelled, world-size differences remain explicit, and no guide claims developer-confirmed puzzle names. All three can be indexed because each answers a distinct stable task and includes sources, recovery steps, and internal links. The Black Sphere page describes corroborated room archetypes and route flow rather than inventing an exact universal seven-room order.

## Rendering and visual design

All content remains statically rendered through the existing Next.js App Router puzzle template. New data lives in a focused content module. The Colored Pegboard locator is an original responsive SVG showing high, low, outer, and board-keeper search zones; it is visibly labelled “search zones, not exact spawn points.” No new dependency or client component is introduced.

## Verification

Each batch begins with a failing Node test and ends with focused green tests. Final verification requires the complete Node suite, TypeScript, Next.js production build, sitemap checks, local HTTP checks, and Tabbit inspection at desktop and mobile widths.

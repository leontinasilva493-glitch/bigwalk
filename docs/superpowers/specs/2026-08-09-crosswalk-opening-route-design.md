# Crosswalk Opening Route Design

## Objective

Publish an original, indexable opening-route guide at `/walkthrough/crosswalk` that helps a new Big Walk group understand the complete Crosswalk unlock loop without pretending that the site has independently captured every route detail. The page should be useful on launch, then become the parent for more detailed puzzle routes and the later secret-ending solution chain.

## Intent ownership

- `/walkthrough/crosswalk` owns searches about unlocking, opening, lowering, or crossing the first Crosswalk and about the opening route as a whole.
- `/puzzles` continues to own individual puzzle discovery.
- Future focused pages may own the crane, telescope, symbol-house, and scaffold challenges. The parent route will link to them when they are independently reviewed.
- Future ending and secret-ending pages remain separate walkthrough routes. This first release must not speculate about either ending.

## Navigation and discovery

The page belongs under the existing `Walkthroughs` primary navigation destination. The `/walkthrough` hub will list it as an available route, and related links will connect it to the puzzle directory and the existing Red Tower Map Room walkthrough. A direct extra global-navigation item is unnecessary because the header already gives the route family a stable owner.

## Page structure

1. Breadcrumb and visible `Source-checked guide` status.
2. Hero with a direct answer describing the overall loop: complete the nearby opening challenges, return their rewards to the beach-side control, prepare the resulting key, and use it at the raised Crosswalk.
3. `Route at a glance` checklist that helps a group track progress without exposing unnecessary detail.
4. `Before you start` section covering party communication, role assignment, and the difference between landmark descriptions and official puzzle names.
5. Four challenge summaries identified by visible landmarks rather than invented official names:
   - high crane control;
   - telescope and remote objective;
   - separated symbol-reading task;
   - coordinated scaffold controls.
6. Key-finish section describing the return-to-panel and cutter-following logic at a general, source-checked level.
7. Failure table for missing rewards, closed remote objectives, rejected symbol sequences, mistimed inputs, and losing the cutter trail.
8. `What this unlocks` section that stops at access to the wider island.
9. `Detailed routes coming next` section that identifies future focused puzzle and ending guides without creating thin URLs.
10. Source links and an original-screenshot capture checklist.

## Content and evidence boundary

- Third-party pages are research inputs, not copy sources. Their wording, screenshots, captions, and distinctive prose will not be reproduced.
- The launch page will paraphrase only cross-checked route logic and will name visual landmarks descriptively.
- Claims that cannot be corroborated will be omitted or described as session-sensitive.
- Player-count changes will be described conservatively. The page will tell visitors to follow the active controls shown in their own world rather than claiming a fixed count for every party size.
- The guide will visibly disclose that it is source-checked and that local original captures are still pending.
- No third-party screenshots will be downloaded or embedded. The existing illustration/capture-request treatment will remain until original captures are supplied.

## Search and indexing

- Canonical URL: `https://bigwalkwalkthrough.com/walkthrough/crosswalk`.
- The guide record will use `status: published`, `evidenceLevel: corroborated`, and `indexable: true` because the user has explicitly approved a source-checked launch page.
- Metadata will target `Big Walk Crosswalk`, `unlock Crosswalk`, and `opening route` without claiming a secret-ending solution.
- Existing detail metadata will emit `robots: index, follow`, Article and BreadcrumbList structured data, and a self-canonical URL.
- The route will enter `sitemap.xml` through the existing `guide.indexable` filter.

## Implementation boundaries

- Reuse the existing guide catalogue and walkthrough detail template.
- Extend the shared published-guide presentation only where the Crosswalk route needs a general route checklist or failure guidance that benefits all future route pages.
- Do not create the four focused puzzle URLs or any ending URL in this release.
- Do not add a dependency, change the global visual system, or copy the competitor layout pixel-for-pixel.
- Preserve unrelated untracked Cloudflare documentation.

## Verification

- Add catalogue tests for the Crosswalk route, intent ownership, evidence state, sources, and sitemap eligibility.
- Verify the `/walkthrough` hub exposes the new route.
- Verify generated metadata includes the self-canonical URL and `index, follow`.
- Run the focused tests, full Node test suite, TypeScript check, and production Next.js build.
- Inspect the built route and generated sitemap before handing the build back for review.

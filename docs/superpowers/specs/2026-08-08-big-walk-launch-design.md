# Big Walk First Release Design

## Objective

Build a standalone, static-first fan guide at the workspace root for the first six Big Walk URLs. The supplied content and design documents are authoritative.

## Information architecture

The root site contains `/`, `/puzzles/`, three individual puzzle routes, and `/walkthrough/red-tower-map-room/`. Pages share one editorial visual system: a warm-paper background, Fraunces headings, forest-green interactive elements, amber spoiler-free hint blocks, and an inky footer.

## Content boundary

Puzzle answers and original annotated screenshots have not yet been verified. The site will not invent them. Every affected page includes its supplied future-state title, unique H1, and meta description, plus a breadcrumb, a general spoiler-free orientation hint, and a clearly labelled “verification in progress” solution panel with an asset hand-off checklist. These pages are `noindex` until the owner replaces the panel with verified playthrough notes and original WebP screenshots; the homepage and puzzle directory remain indexable. This deliberately keeps the supplied SEO copy ready for release while preventing placeholder pages from being presented in search as solved guides.

## Rendering and SEO

Use Next.js App Router static rendering. All visible page content and schema are emitted in HTML. Each page has Article and BreadcrumbList JSON-LD only; there is no FAQPage. Metadata titles and descriptions exactly match the supplied table. The sitemap and robots directives describe the first-release public routes and exclude placeholder detail pages from search indexing.

## Components

`SiteHeader`, `SiteFooter`, `HintBlock`, `VerificationPanel`, `PuzzleCard`, `CategoryCard`, `Breadcrumbs`, and `JsonLd` are small server-rendered components. A typed content model is the single source for routes, metadata, taxonomy, related links, and asset requirements.

## Quality checks

Use Node’s test runner to prove the content model exposes exactly the approved four guide pages and rejects unapproved slugs. Follow with TypeScript checking and a Next.js production build. Review routes with the production server after building.

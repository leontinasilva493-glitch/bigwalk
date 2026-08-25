# Big Walk Demand Pages and Map Design

## Goal

Ship the approved P0 search-intent pages and a genuinely useful `/map` product page while preserving the site's evidence gates, spoiler control, and current visual language.

## URL ownership

- `/patch-notes` owns update, update today, current version, and patch notes intent.
- `/walkthrough/black-tower` owns Black Tower, vision, Black Key, Wall, and Black Sphere handoff intent.
- `/puzzles/colored-pegboard` owns the circular 36-piece colored pegboard. `/puzzles/peg-puzzle` remains Forget-Me-Not only.
- `/puzzles/purple-challenges` owns the seven post-game purple challenges and purple reward use.
- `/walkthrough/true-ending` owns the 15-item completion audit, White Key, split sphere, and Big Game route.
- `/achievements` remains the single trophy, achievement, and Platinum roadmap URL.
- `/map` owns searchable/filterable landmark discovery and a local completion checklist.

## Evidence model

Official House House/Panic pages are authoritative for versions, platforms, player-count variants, hosting, saving, accessibility, and compatibility. Current community reports may support puzzle identity, observed route behavior, and recurring recovery questions, but are labeled and never presented as developer-confirmed. Indexable pages require a useful answer, at least two independent sources where gameplay is involved, a checked date, current-version context, and explicit uncertainty where reports differ.

## Page behavior

Static content and metadata remain Server Components. The map's search, category filters, spoiler toggle, selected marker, and local completion checklist live in one small Client Component. Map state is persisted in versioned `localStorage`; the page still renders a complete searchable landmark directory when JavaScript is unavailable.

The map is an original schematic field map, not a copied game map and not a claim of pixel-accurate coordinates. Each marker is linked to a real guide or labelled as a sourced community landmark. Spoiler-sensitive ending markers are hidden by default.

## Navigation and SEO

Indexable new pages receive self-canonical metadata, Article or CollectionPage JSON-LD where appropriate, internal links from relevant hubs, and sitemap entries. No duplicate trophy, White Key, wiki, or retailer pages are created. The homepage surfaces current-version and map entry points without replacing the user's existing related-guide work.

## Verification

Use Node test runner regression tests, TypeScript typecheck, Next.js production build, local production-server HTTP checks, and desktop/mobile visual inspection of `/map`, `/patch-notes`, Black Tower, Colored Pegboard, Purple Challenges, True Ending, and Achievements.

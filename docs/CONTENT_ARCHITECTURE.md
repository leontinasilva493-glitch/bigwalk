# Big Walk content architecture

This document maps the approved content plan to the current App Router structure. It is intentionally explicit so a future guide is added to the right intent owner rather than becoming another near-duplicate URL.

## Current public structure

```text
app/
  page.tsx                                      /
  puzzles/
    page.tsx                                    /puzzles
    purple-challenges/page.tsx                  /puzzles/purple-challenges
    [...slug]/page.tsx                          /puzzles/[verified-puzzle-slug]
  walkthrough/
    page.tsx                                    /walkthrough
    [...slug]/page.tsx                          /walkthrough/[verified-walkthrough-slug]
  achievements/page.tsx                         /achievements
  beginner-guide/
    page.tsx                                    /beginner-guide
    can-you-play-solo/page.tsx                  /beginner-guide/can-you-play-solo
  multiplayer/
    page.tsx                                    /multiplayer
    best-group-size/page.tsx                    /multiplayer/best-group-size
    hosting-and-saves/page.tsx                  /multiplayer/hosting-and-saves
    transfer-save-to-new-host/page.tsx          /multiplayer/transfer-save-to-new-host
    how-to-find-players/page.tsx                /multiplayer/how-to-find-players
    drop-in-host-save/page.tsx                  legacy redirect to /multiplayer/hosting-and-saves
  troubleshooting/
    page.tsx                                    /troubleshooting
    cant-rejoin-after-disconnect/page.tsx       /troubleshooting/cant-rejoin-after-disconnect
    voice-chat-not-working/page.tsx             /troubleshooting/voice-chat-not-working
    crossplay-switch-2/page.tsx                 /troubleshooting/crossplay-switch-2
    white-screen-and-crash/page.tsx             /troubleshooting/white-screen-and-crash
```

The existing detail records are `green-chair-headphones`, `purple-things-where-to-use`, `4166-1899-coordinates`, and `red-tower-map-room`. Their visual names and search aliases live in `lib/content.mjs`; they must not become separate URLs.

## Evidence and indexing policy

- Every guide record now carries aliases, visual cues, landmarks, player-count variants, prerequisites, steps, failures, tested platforms, sources, a status, and an evidence level.
- All new topic pages use `components/evidence-page.tsx`. They have canonical metadata, Article and BreadcrumbList JSON-LD, and `noindex, follow` while evidence is incomplete.
- `app/sitemap.ts` remains deliberately unchanged: only `indexable` guide records enter the sitemap.
- An individual achievement route, the conditional green-platform puzzle, and FAQ leaves are not created yet. Each needs current, differentiated first-hand evidence; an empty or inferred page would be less useful than the existing evidence-gated hub.

## Promotion rule

A page may become indexable only after its record has a current version, first-hand evidence, a verified date, a source list, and a complete answer with any required original screenshots. At that point, set `status` to `verified`, `evidenceLevel` to `first_hand` or `corroborated`, and `indexable` to `true` in the same content update.

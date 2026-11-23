import { guides, site, siteSections } from '../../lib/content.mjs';
import { currentVersion } from '../../lib/updates-content.mjs';

export const dynamic = 'force-static';

export async function GET() {
  const indexablePuzzles = guides.filter((g) => g.kind === 'puzzle' && g.indexable);
  const indexableWalkthroughs = guides.filter((g) => g.kind === 'walkthrough' && g.indexable);
  const indexableHubs = siteSections.filter((s) => s.indexable);

  const lines = [
    `# ${site.name}`,
    '',
    `> Independent spoiler-aware puzzle solutions, co-op tower walkthroughs, interactive landmark map, and co-op mechanics for Big Walk by House House (PC, Mac, PS5, Nintendo Switch 2; latest tracked version ${currentVersion.version}).`,
    '',
    '## Core Hubs & Tools',
    `- [Big Walk Walkthrough Home](${site.url}/): Quick puzzle finder by visual clue, tower, item, or coordinates.`,
    `- [Interactive Map & Completion Checklist](${site.url}/map): Searchable island map for towers, puzzles, radio stations, and 100% completion tracking.`,
    `- [All Big Walk Puzzles Directory](${site.url}/puzzles): Visual clue directory and Map Room marker legend.`,
    `- [Patch Notes & Current Version](${site.url}/patch-notes): Official Big Walk version history (v${currentVersion.version}).`,
    ...indexableHubs.map((hub) => `- [${hub.h1}](${site.url}/${hub.slug}): ${hub.description}`),
    '',
    '## Puzzle Solutions',
    ...indexablePuzzles.map((g) => `- [${g.h1}](${site.url}/${g.slug}): ${g.description}`),
    '',
    '## Tower Routes & Endgame Walkthroughs',
    ...indexableWalkthroughs.map((g) => `- [${g.h1}](${site.url}/${g.slug}): ${g.description}`),
    '',
    '## Policies & Contact',
    `- [Privacy Policy](${site.url}/privacy)`,
    `- [Terms of Use](${site.url}/terms)`,
    `- [Contact & Corrections](${site.url}/contact)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

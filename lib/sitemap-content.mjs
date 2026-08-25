const discoveryEntries = Object.freeze([
  { path: '/', lastModified: '2026-08-25' },
  { path: '/puzzles', lastModified: '2026-08-25' },
  { path: '/map', lastModified: '2026-08-25' },
  { path: '/patch-notes', lastModified: '2026-08-25' },
]);

export const sitemapPriorityPaths = Object.freeze({
  P0: Object.freeze([
    '/',
    '/map',
    '/patch-notes',
    '/puzzles',
    '/walkthrough',
    '/achievements',
    '/walkthrough/black-tower',
    '/walkthrough/true-ending',
    '/puzzles/colored-pegboard',
    '/puzzles/purple-challenges',
  ]),
  P1: Object.freeze([
    '/beginner-guide',
    '/multiplayer',
    '/multiplayer/how-to-find-players',
    '/puzzles/peg-puzzle',
    '/puzzles/green-chair-headphones',
    '/puzzles/4166-1899-coordinates',
    '/walkthrough/red-tower-map-room',
    '/walkthrough/blue-tower-train',
    '/walkthrough/green-tower-chairlift',
    '/walkthrough/yellow-tower-tunnels',
  ]),
});

const priorityRank = Object.freeze({ P0: 0, P1: 1, P2: 2 });
const explicitOrder = new Map(
  [...sitemapPriorityPaths.P0, ...sitemapPriorityPaths.P1]
    .map((path, index) => [path, index]),
);

function priorityBandFor(path) {
  if (sitemapPriorityPaths.P0.includes(path)) return 'P0';
  if (sitemapPriorityPaths.P1.includes(path)) return 'P1';
  return 'P2';
}

export function buildSitemapEntries({ guides, siteSections }) {
  const entriesByPath = new Map();
  const addEntry = (path, lastModified) => {
    entriesByPath.set(path, {
      path,
      lastModified,
      priorityBand: priorityBandFor(path),
    });
  };

  for (const entry of discoveryEntries) addEntry(entry.path, entry.lastModified);
  for (const guide of guides.filter((entry) => entry.indexable)) {
    addEntry(`/${guide.slug}`, guide.updated);
  }
  for (const section of siteSections.filter((entry) => entry.indexable)) {
    addEntry(`/${section.slug}`, section.updated);
  }

  return [...entriesByPath.values()].sort((left, right) => {
    const bandDifference = priorityRank[left.priorityBand] - priorityRank[right.priorityBand];
    if (bandDifference !== 0) return bandDifference;

    const leftOrder = explicitOrder.get(left.path);
    const rightOrder = explicitOrder.get(right.path);
    if (leftOrder !== undefined && rightOrder !== undefined) return leftOrder - rightOrder;
    return left.path.localeCompare(right.path);
  });
}

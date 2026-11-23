const discoveryEntries = Object.freeze([
  { path: '/', lastModified: '2026-11-23' },
  { path: '/puzzles', lastModified: '2026-11-23' },
  { path: '/map', lastModified: '2026-08-25' },
]);

export const sitemapPriorityPaths = Object.freeze({
  P0: Object.freeze([
    '/',
    '/puzzles/peg-puzzle',
    '/puzzles/green-chair-headphones',
    '/walkthrough/true-ending',
    '/puzzles/4166-1899-coordinates',
    '/walkthrough/radio-channels',
    '/puzzles/heavy-ball',
    '/puzzles',
    '/walkthrough',
    '/map',
    '/achievements',
    '/puzzles/blue-platform-four-piece',
    '/walkthrough/black-tower',
    '/puzzles/colored-pegboard',
    '/puzzles/purple-challenges',
  ]),
  P1: Object.freeze([
    '/puzzles/black-sphere',
    '/walkthrough/red-tower-map-room',
    '/walkthrough/blue-tower-train',
    '/walkthrough/green-tower-chairlift',
    '/walkthrough/yellow-tower-tunnels',
    '/walkthrough/crosswalk',
    '/beginner-guide',
    '/multiplayer',
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

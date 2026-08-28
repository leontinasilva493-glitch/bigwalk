/**
 * @param {ReadonlyArray<{ title: string, publisher: string, url: string }>} sources
 */
export function primarySourcesView(sources = []) {
  return {
    heading: 'Primary sources',
    sources: sources.map(({ title, publisher, url }) => ({ title, publisher, url })),
  };
}

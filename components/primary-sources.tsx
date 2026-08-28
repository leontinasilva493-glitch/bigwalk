import { primarySourcesView } from '../lib/primary-sources.mjs';

type Source = {
  title: string;
  publisher: string;
  url: string;
};

export function PrimarySources({
  sources,
  headingId = 'primary-sources-heading',
  sectionId,
  className = 'guide-sources',
}: {
  sources?: readonly Source[];
  headingId?: string;
  sectionId?: string;
  className?: string;
}) {
  if (!sources?.length) return null;
  const view = primarySourcesView(sources) as { heading: string; sources: Source[] };

  return (
    <section id={sectionId} className={className} aria-labelledby={headingId}>
      <h2 id={headingId}>{view.heading}</h2>
      <ul>
        {view.sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>{' '}
            <span>— {source.publisher}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

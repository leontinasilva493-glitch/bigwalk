'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type MapPoint = {
  id: string;
  name: string;
  category: string;
  summary: string;
  landmark: string;
  href: string;
  x: number;
  y: number;
  spoiler: boolean;
  sourceLabel: string;
};

type Category = { id: string; label: string };

const STORAGE_KEY = 'big-walk-map-v1';

export function MapExplorer({ points, categories }: { points: readonly MapPoint[]; categories: readonly Category[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [selectedId, setSelectedId] = useState(points[0]?.id ?? '');
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setCompleted(new Set(JSON.parse(saved) as string[]));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const visiblePoints = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return points.filter((point) => (
      (showSpoilers || !point.spoiler)
      && (category === 'all' || point.category === category)
      && (!normalizedQuery || `${point.name} ${point.summary} ${point.landmark}`.toLowerCase().includes(normalizedQuery))
    ));
  }, [category, points, query, showSpoilers]);

  const selected = visiblePoints.find((point) => point.id === selectedId) ?? visiblePoints[0];
  const hiddenSpoilers = points.filter((point) => point.spoiler).length;

  function saveCompleted(next: Set<string>) {
    setCompleted(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  }

  function toggleComplete(id: string) {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    saveCompleted(next);
  }

  function resetChecklist() {
    saveCompleted(new Set());
  }

  return (
    <section className="map-explorer" aria-labelledby="map-explorer-heading">
      <div className="map-explorer__intro">
        <div><p className="hint-block__kicker">SEARCH · FILTER · CHECK OFF</p><h2 id="map-explorer-heading">Plan the next walk</h2></div>
        <p aria-live="polite">Showing {visiblePoints.length} of {points.length} locations · {completed.size} marked complete</p>
      </div>

      <div className="map-controls">
        <label className="map-search"><span>Search locations</span><input aria-label="Search map locations" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tower, pegboard, train, key…" /></label>
        <div className="map-category-filters" aria-label="Filter map locations">
          {categories.map((item) => <button type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)} key={item.id}>{item.label}</button>)}
        </div>
        <label className="map-spoiler-toggle"><input type="checkbox" checked={showSpoilers} onChange={(event) => setShowSpoilers(event.target.checked)} /><span>Show ending spoilers <small>({hiddenSpoilers} locations)</small></span></label>
      </div>

      <div className="map-workspace">
        <div className="schematic-map" role="img" aria-label="Schematic Big Walk island field map with selectable markers">
          <div className="schematic-map__water" aria-hidden="true" />
          <div className="schematic-map__island" aria-hidden="true"><span className="map-ridge map-ridge--one" /><span className="map-ridge map-ridge--two" /><span className="map-path map-path--one" /><span className="map-path map-path--two" /></div>
          {visiblePoints.map((point) => (
            <button
              className={`map-marker map-marker--${point.category}${completed.has(point.id) ? ' is-complete' : ''}${selected?.id === point.id ? ' is-selected' : ''}`}
              type="button"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              aria-label={`${point.name}${completed.has(point.id) ? ', complete' : ''}`}
              aria-pressed={selected?.id === point.id}
              onClick={() => setSelectedId(point.id)}
              key={point.id}
            ><span>{completed.has(point.id) ? '✓' : ''}</span><small>{point.name}</small></button>
          ))}
          {!visiblePoints.length ? <p className="map-empty">No locations match those filters.</p> : null}
        </div>

        <aside className="map-detail" aria-live="polite">
          {selected ? (
            <>
              <p className="map-detail__category">{selected.category}{selected.spoiler ? ' · spoiler' : ''}</p>
              <h3>{selected.name}</h3>
              <p>{selected.summary}</p>
              <dl><div><dt>Look for</dt><dd>{selected.landmark}</dd></div><div><dt>Evidence</dt><dd>{selected.sourceLabel}</dd></div></dl>
              <div className="map-detail__actions">
                <Link href={selected.href}>Open guide <span aria-hidden="true">→</span></Link>
                <button type="button" onClick={() => toggleComplete(selected.id)}>{completed.has(selected.id) ? 'Mark incomplete' : 'Mark complete'}</button>
              </div>
            </>
          ) : <p>Select a visible marker to read its route note.</p>}
        </aside>
      </div>

      <div className="map-checklist-header"><h3>Visible location checklist</h3><button type="button" onClick={resetChecklist} disabled={!completed.size}>Reset checklist</button></div>
      <div className="map-location-list">
        {visiblePoints.map((point) => (
          <article className={completed.has(point.id) ? 'is-complete' : ''} key={point.id}>
            <button type="button" onClick={() => toggleComplete(point.id)} aria-label={`${completed.has(point.id) ? 'Mark incomplete' : 'Mark complete'}: ${point.name}`}>{completed.has(point.id) ? '✓' : ''}</button>
            <div><h4><button type="button" onClick={() => setSelectedId(point.id)}>{point.name}</button></h4><p>{point.landmark}</p></div>
            <Link href={point.href} aria-label={`Open guide for ${point.name}`}>Guide →</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

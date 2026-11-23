'use client';

import Link from 'next/link';
import { useState } from 'react';

export type ClueFinderItem = {
  slug: string;
  h1: string;
  area: string;
  tower: string;
  kind: string;
  keywords: string;
};

const quickChips = [
  { label: 'Forget-Me-Not', query: 'forget me not' },
  { label: '4166 / 1466', query: '4166' },
  { label: 'Music Chair', query: 'music chair' },
  { label: 'Silver / White Key', query: 'silver key' },
  { label: 'Station 6', query: 'station 6' },
  { label: 'Bowling Ball', query: 'bowling ball' },
];

export function ClueFinder({ items }: { items: ClueFinderItem[] }) {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();

  const matches = normalized
    ? items.filter((item) => item.keywords.includes(normalized)).slice(0, 6)
    : [];

  return (
    <div className="clue-finder" role="region" aria-label="Quick clue finder">
      <label className="clue-finder__label" htmlFor="clue-finder-input">
        Search by clue, landmark, key, or coordinates
      </label>
      <div className="clue-finder__bar">
        <input
          id="clue-finder-input"
          className="clue-finder__input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try: forget me not, 4166 / 1466, music chair, silver key, amphitheater, station 6..."
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            className="clue-finder__clear"
            onClick={() => setQuery('')}
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="clue-finder__chips" aria-label="Popular player searches">
        {quickChips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            className="clue-finder__chip"
            onClick={() => setQuery(chip.query)}
          >
            {chip.label}
          </button>
        ))}
      </div>
      {normalized ? (
        <div className="clue-finder__results" aria-live="polite">
          {matches.length ? (
            <ul>
              {matches.map((item) => (
                <li key={item.slug}>
                  <Link href={`/${item.slug}`}>
                    <strong>{item.h1}</strong>
                    <span>{item.tower} · {item.area}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="clue-finder__empty">
              No exact clue match for &ldquo;{query.trim()}&rdquo;. Check the <Link href="/map">Interactive Map</Link> or <Link href="/puzzles">All Puzzles Directory</Link>.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

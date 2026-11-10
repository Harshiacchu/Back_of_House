import PropTypes from 'prop-types';
import { useCallback, useId, useState } from 'react';

import { searchRestaurants } from '../../../api/restaurants.js';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue.js';
import { useFetch } from '../../../hooks/useFetch.js';
import './RestaurantPicker.css';

const EMPTY = Promise.resolve({ items: [] });

// Search-and-pick a restaurant. Public contract: other features may import this (read-only).
// value: { _id, name } | null; onChange(restaurant | null).
export default function RestaurantPicker({ label = 'Restaurant', value, onChange }) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query.trim(), 250);
  const loader = useCallback(
    (signal) =>
      debounced.length < 2 ? EMPTY : searchRestaurants({ q: debounced, limit: 6 }, signal),
    [debounced],
  );
  const { data, loading } = useFetch(loader);

  if (value) {
    return (
      <div className="restaurant-picker">
        <span className="restaurant-picker__label">{label}</span>
        <p className="restaurant-picker__chosen">
          <span>{value.name}</span>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => onChange(null)}
          >
            Change
          </button>
        </p>
      </div>
    );
  }

  const results = data?.items ?? [];
  return (
    <div className="restaurant-picker">
      <label htmlFor={inputId} className="restaurant-picker__label">
        {label}
      </label>
      <input
        id={inputId}
        type="search"
        className="restaurant-picker__input"
        value={query}
        placeholder="Start typing a restaurant name"
        autoComplete="off"
        onChange={(e) => setQuery(e.target.value)}
      />
      {debounced.length >= 2 && (
        <ul className="restaurant-picker__results" aria-live="polite">
          {loading && <li className="restaurant-picker__hint">Searching…</li>}
          {!loading && results.length === 0 && (
            <li className="restaurant-picker__hint">No restaurants match “{debounced}”.</li>
          )}
          {results.map((r) => (
            <li key={r._id}>
              <button
                type="button"
                className="restaurant-picker__option"
                onClick={() => onChange({ _id: r._id, name: r.name })}
              >
                <strong>{r.name}</strong>
                <span>{r.neighborhood}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

RestaurantPicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.shape({ _id: PropTypes.string.isRequired, name: PropTypes.string.isRequired }),
  onChange: PropTypes.func.isRequired,
};

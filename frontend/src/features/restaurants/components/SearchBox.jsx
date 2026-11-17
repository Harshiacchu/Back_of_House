import PropTypes from 'prop-types';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { suggestRestaurants } from '../../../api/restaurants.js';
import SeverityBadge from '../../../components/SeverityBadge.jsx';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue.js';
import { useFetch } from '../../../hooks/useFetch.js';
import MatchHighlight from './MatchHighlight.jsx';
import './SearchBox.css';

const NONE = Promise.resolve({ suggestions: [] });
const MIN_CHARS = 2;

// Name search with live suggestions (ARIA combobox). Typing filters the results below; arrow
// keys + Enter, or a click, jump straight to one kitchen's report.
export default function SearchBox({ value, onChange }) {
  const inputId = useId();
  const listId = useId();
  const navigate = useNavigate();
  const closeTimer = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const typed = useDebouncedValue(value.trim(), 150);
  const wanted = open && typed.length >= MIN_CHARS;
  const loader = useCallback(
    (signal) => (wanted ? suggestRestaurants(typed, signal) : NONE),
    [wanted, typed],
  );
  const { data } = useFetch(loader);
  const suggestions = wanted ? (data?.suggestions ?? []) : [];
  const activeIndex = active < suggestions.length ? active : -1;
  const expanded = suggestions.length > 0;

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (event.key === 'Escape') {
      setOpen(false);
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      navigate(`/restaurants/${suggestions[activeIndex]._id}`);
    }
  }

  return (
    <div className="search-box">
      <label htmlFor={inputId} className="search-box__label">
        Restaurant name
      </label>
      <input
        id={inputId}
        type="search"
        role="combobox"
        className="search-box__input"
        value={value}
        placeholder="Try “oyster”, “pizza”, “north end cafe”"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        onChange={(e) => {
          onChange(e.target.value);
          setActive(-1);
          setOpen(true);
        }}
        onFocus={() => {
          clearTimeout(closeTimer.current);
          setOpen(true);
        }}
        onBlur={() => {
          // Let a click on a suggestion land before the list closes.
          closeTimer.current = setTimeout(() => setOpen(false), 150);
        }}
        onKeyDown={handleKeyDown}
      />
      <ul id={listId} role="listbox" className="search-box__list" hidden={!expanded}>
        {suggestions.map((s, i) => (
          <li
            key={s._id}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === activeIndex}
            className="search-box__option"
          >
            <Link to={`/restaurants/${s._id}`} tabIndex={-1} className="search-box__link">
              <span className="search-box__name">
                <MatchHighlight text={s.name} query={typed} />
              </span>
              <span className="search-box__hood">{s.neighborhood || 'Boston'}</span>
              {s.summary?.severityScore != null && (
                <SeverityBadge score={s.summary.severityScore} />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

SearchBox.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

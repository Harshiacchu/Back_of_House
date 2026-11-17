import PropTypes from 'prop-types';

import { TRAJECTORIES } from '../../../utils/propShapes.js';
import { PAGE_SIZES, SORT_OPTIONS } from '../searchOptions.js';
import SearchBox from './SearchBox.jsx';
import './RestaurantFilters.css';

const TRENDS = ['All', ...TRAJECTORIES];

export default function RestaurantFilters({
  query,
  onQueryChange,
  neighborhood,
  trajectory,
  sort,
  size,
  neighborhoods,
  onChange,
}) {
  return (
    <form className="restaurant-filters" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="restaurant-filters__row">
        <div className="restaurant-filters__query">
          <SearchBox value={query} onChange={onQueryChange} />
        </div>
        <label className="restaurant-filters__field restaurant-filters__hood">
          <span className="restaurant-filters__label">Neighborhood</span>
          <span className="restaurant-filters__select">
            <select
              value={neighborhood}
              onChange={(e) => onChange({ neighborhood: e.target.value })}
            >
              <option value="">All neighborhoods</option>
              {neighborhoods.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </span>
        </label>
      </div>

      <div className="restaurant-filters__row">
        <fieldset className="restaurant-filters__group">
          <legend>Trajectory</legend>
          <div className="restaurant-filters__toggle">
            {TRENDS.map((option) => {
              const value = option === 'All' ? '' : option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={trajectory === value}
                  className="restaurant-filters__chip"
                  onClick={() => onChange({ trajectory: value })}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="restaurant-filters__field restaurant-filters__sort">
          <span className="restaurant-filters__label">Sort by</span>
          <span className="restaurant-filters__select">
            <select value={sort} onChange={(e) => onChange({ sort: e.target.value })}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
        </label>

        <fieldset className="restaurant-filters__group">
          <legend>Per page</legend>
          <div className="restaurant-filters__toggle">
            {PAGE_SIZES.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={size === n}
                className="restaurant-filters__chip restaurant-filters__chip--narrow"
                onClick={() => onChange({ size: n })}
              >
                {n}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </form>
  );
}

RestaurantFilters.propTypes = {
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  neighborhood: PropTypes.string.isRequired,
  trajectory: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  neighborhoods: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

import PropTypes from 'prop-types';

import { TRAJECTORIES } from '../../../utils/propShapes.js';
import './RestaurantFilters.css';

const OPTIONS = ['All', ...TRAJECTORIES];

export default function RestaurantFilters({
  query,
  neighborhood,
  trajectory,
  neighborhoods,
  onChange,
}) {
  return (
    <form className="restaurant-filters" role="search" onSubmit={(e) => e.preventDefault()}>
      <label className="field restaurant-filters__query">
        Restaurant name
        <input
          type="search"
          value={query}
          placeholder="Try “noodle”, “pizza”, “cafe”"
          onChange={(e) => onChange({ query: e.target.value })}
        />
      </label>

      <label className="field restaurant-filters__hood">
        Neighborhood
        <select value={neighborhood} onChange={(e) => onChange({ neighborhood: e.target.value })}>
          <option value="">All neighborhoods</option>
          {neighborhoods.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="restaurant-filters__trend">
        <legend>Trajectory</legend>
        <div className="restaurant-filters__toggle">
          {OPTIONS.map((option) => {
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
    </form>
  );
}

RestaurantFilters.propTypes = {
  query: PropTypes.string.isRequired,
  neighborhood: PropTypes.string.isRequired,
  trajectory: PropTypes.string.isRequired,
  neighborhoods: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

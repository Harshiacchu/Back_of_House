import PropTypes from 'prop-types';

import { restaurantNameShape } from '../pollShapes.js';
import './CandidateList.css';

// The restaurants picked so far in the poll form, each removable.
export default function CandidateList({ restaurants, onRemove }) {
  if (restaurants.length === 0) {
    return <p className="candidate-list__empty">No restaurants yet. Search for one below.</p>;
  }
  return (
    <ol className="candidate-list">
      {restaurants.map((restaurant) => (
        <li key={restaurant._id} className="candidate-list__item">
          <span className="candidate-list__name">{restaurant.name}</span>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            aria-label={`Remove ${restaurant.name}`}
            onClick={() => onRemove(restaurant._id)}
          >
            Remove
          </button>
        </li>
      ))}
    </ol>
  );
}

CandidateList.propTypes = {
  restaurants: PropTypes.arrayOf(restaurantNameShape).isRequired,
  onRemove: PropTypes.func.isRequired,
};

import { Link } from 'react-router-dom';

import SeverityBadge from '../../../components/SeverityBadge.jsx';
import TrajectoryBadge from '../../../components/TrajectoryBadge.jsx';
import { formatDate } from '../../../utils/format.js';
import { restaurantSummaryShape } from '../../../utils/propShapes.js';
import './RestaurantCard.css';

// One search result.
export default function RestaurantCard({ restaurant }) {
  const { summary = {} } = restaurant;
  return (
    <Link to={`/restaurants/${restaurant._id}`} className="restaurant-card">
      <span className="restaurant-card__hood">{restaurant.neighborhood || 'Boston'}</span>
      <span className="restaurant-card__name">{restaurant.name}</span>
      {restaurant.address && <span className="restaurant-card__address">{restaurant.address}</span>}
      <span className="restaurant-card__footer">
        {summary.severityScore != null && <SeverityBadge score={summary.severityScore} />}
        {summary.trajectory && <TrajectoryBadge trajectory={summary.trajectory} />}
      </span>
      <span className="restaurant-card__date">
        Inspected {formatDate(summary.lastInspectionDate)}
      </span>
    </Link>
  );
}

RestaurantCard.propTypes = {
  restaurant: restaurantSummaryShape.isRequired,
};

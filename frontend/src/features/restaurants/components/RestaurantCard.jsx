import { Link } from 'react-router-dom';

import TrajectoryBadge from '../../../components/TrajectoryBadge.jsx';
import { formatDate } from '../../../utils/format.js';
import { restaurantSummaryShape } from '../../../utils/propShapes.js';
import InspectionStrip from './InspectionStrip.jsx';
import ScoreTile from './ScoreTile.jsx';
import './RestaurantCard.css';

// One search result: the score up front, the recent inspection history as a strip.
export default function RestaurantCard({ restaurant }) {
  const { summary = {} } = restaurant;
  const score = summary.severityScore;
  return (
    <Link to={`/restaurants/${restaurant._id}`} className="restaurant-card">
      <span className="restaurant-card__top">
        {score != null && <ScoreTile score={score} />}
        <span className="restaurant-card__title">
          <span className="restaurant-card__hood">{restaurant.neighborhood || 'Boston'}</span>
          <span className="restaurant-card__name">{restaurant.name}</span>
        </span>
      </span>
      {restaurant.address && <span className="restaurant-card__address">{restaurant.address}</span>}
      <InspectionStrip scores={summary.recentScores} />
      <span className="restaurant-card__footer">
        {summary.trajectory && <TrajectoryBadge trajectory={summary.trajectory} />}
        <span className="restaurant-card__date">
          {[`Inspected ${formatDate(summary.lastInspectionDate)}`, summary.lastResult]
            .filter(Boolean)
            .join(' · ')}
        </span>
      </span>
    </Link>
  );
}

RestaurantCard.propTypes = {
  restaurant: restaurantSummaryShape.isRequired,
};

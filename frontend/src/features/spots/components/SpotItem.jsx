import { Link } from 'react-router-dom';

import SeverityBadge from '../../../components/SeverityBadge.jsx';
import TrajectoryBadge from '../../../components/TrajectoryBadge.jsx';
import { spotItemShape } from '../spotShapes.js';
import './SpotItem.css';

// One saved restaurant: today's kitchen score and trend, plus the user's note.
export default function SpotItem({ item }) {
  const { restaurant, note } = item;
  const { summary = {} } = restaurant;
  return (
    <div className="spot-item">
      <span className="spot-item__hood">{restaurant.neighborhood || 'Boston'}</span>
      <Link to={`/restaurants/${restaurant._id}`} className="spot-item__name">
        {restaurant.name}
      </Link>
      <span className="spot-item__badges">
        {summary.severityScore != null && <SeverityBadge score={summary.severityScore} />}
        {summary.trajectory && <TrajectoryBadge trajectory={summary.trajectory} />}
      </span>
      {note && <p className="spot-item__note">{note}</p>}
    </div>
  );
}

SpotItem.propTypes = {
  item: spotItemShape.isRequired,
};

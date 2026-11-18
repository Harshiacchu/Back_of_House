import PropTypes from 'prop-types';

import { visitShape } from '../../../utils/propShapes.js';
import './VisitStats.css';

// Four numbers that sum up the log: meals, neighborhoods, average stars, share of clean kitchens.
export default function VisitStats({ visits }) {
  const rated = visits.filter((v) => v.rating != null);
  const inspected = visits.filter((v) => v.inspectionAtVisit);
  const neighborhoods = new Set(visits.map((v) => v.restaurant.neighborhood).filter(Boolean));
  const average = rated.length
    ? (rated.reduce((sum, v) => sum + v.rating, 0) / rated.length).toFixed(1)
    : '–';
  const clean = inspected.filter((v) => v.inspectionAtVisit.severityScore < 20).length;
  const cleanShare = inspected.length ? `${Math.round((clean / inspected.length) * 100)}%` : '–';

  const stats = [
    { label: visits.length === 1 ? 'Meal logged' : 'Meals logged', value: visits.length },
    { label: 'Neighborhoods', value: neighborhoods.size },
    { label: 'Average rating', value: average, suffix: '★' },
    { label: 'Clean kitchens', value: cleanShare },
  ];

  return (
    <dl className="visit-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="visit-stats__item">
          <dt>{stat.label}</dt>
          <dd>
            {stat.value}
            {stat.suffix && average !== '–' && (
              <span className="visit-stats__suffix" aria-hidden="true">
                {stat.suffix}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

VisitStats.propTypes = {
  visits: PropTypes.arrayOf(visitShape).isRequired,
};

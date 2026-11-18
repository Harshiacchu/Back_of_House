import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getRestaurant } from '../../../api/restaurants.js';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import LoadingState from '../../../components/LoadingState.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { formatDate } from '../../../utils/format.js';
import InspectionHistory from '../components/InspectionHistory.jsx';
import SeverityMeter from '../components/SeverityMeter.jsx';
import TrajectoryChart from '../components/TrajectoryChart.jsx';
import './RestaurantDetailPage.css';

const CHART_POINTS = 12;

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const loader = useCallback((signal) => getRestaurant(id, signal), [id]);
  const { data, error, loading, reload } = useFetch(loader);
  useDocumentTitle(data?.restaurant.name ?? 'Kitchen Report');

  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;
  if (loading || !data) return <LoadingState label="Loading report…" />;

  const { restaurant, inspections } = data;
  const { summary = {} } = restaurant;
  const points = inspections
    .slice(0, CHART_POINTS)
    .reverse()
    .map((inspection) => ({ date: inspection.date, score: inspection.severityScore }));
  const visitLink = `/visits?restaurant=${restaurant._id}&name=${encodeURIComponent(restaurant.name)}`;

  return (
    <article className="restaurant-detail">
      <Link to="/restaurants" className="restaurant-detail__back">
        ‹ Kitchen Reports
      </Link>

      <header className="restaurant-detail__header">
        <div className="restaurant-detail__heading">
          <p className="eyebrow">Kitchen report</p>
          <h1 className="restaurant-detail__name">{restaurant.name}</h1>
          <p className="restaurant-detail__address">
            {[restaurant.address, restaurant.neighborhood].filter(Boolean).join(' · ')}
          </p>
        </div>
        <Link to={visitLink} className="btn btn--primary">
          Log a visit
        </Link>
      </header>

      <div className="restaurant-detail__stats">
        {summary.severityScore != null && <SeverityMeter score={summary.severityScore} />}
        <TrajectoryChart points={points} trajectory={summary.trajectory} />
        <div className="restaurant-detail__last">
          <span className="eyebrow">Last inspection</span>
          <span className="restaurant-detail__last-date">
            {formatDate(summary.lastInspectionDate)}
          </span>
          <span className="restaurant-detail__last-result">{summary.lastResult || '—'}</span>
          <span className="restaurant-detail__last-count">
            {inspections.length} inspection{inspections.length === 1 ? '' : 's'} on record
          </span>
        </div>
      </div>

      <section className="restaurant-detail__history" aria-labelledby="history-title">
        <h2 id="history-title">What inspectors found</h2>
        <InspectionHistory inspections={inspections} />
      </section>
    </article>
  );
}

RestaurantDetailPage.propTypes = {};

import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import SeverityBadge from '../../../components/SeverityBadge.jsx';
import { formatDate } from '../../../utils/format.js';
import { visitShape } from '../../../utils/propShapes.js';
import './VisitItem.css';

// One visit: the meal, and what the kitchen looked like that day.
export default function VisitItem({ visit, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const inspection = visit.inspectionAtVisit;

  return (
    <article className="visit-item">
      <header className="visit-item__header">
        <span className="visit-item__date">{formatDate(visit.visitDate)}</span>
        {visit.rating != null && (
          <span className="visit-item__rating" aria-label={`${visit.rating} out of 5 stars`}>
            {'★'.repeat(visit.rating)}
            <span className="visit-item__rating-off">{'★'.repeat(5 - visit.rating)}</span>
          </span>
        )}
      </header>

      <h3 className="visit-item__name">
        <Link to={`/restaurants/${visit.restaurant._id}`}>{visit.restaurant.name}</Link>
      </h3>
      {visit.dish && <p className="visit-item__dish">{visit.dish}</p>}
      {visit.notes && <p className="visit-item__notes">{visit.notes}</p>}

      <div className="visit-item__kitchen">
        <span className="eyebrow">Kitchen that day</span>
        {inspection ? (
          <p>
            Last inspected {formatDate(inspection.date)}: <strong>{inspection.result}</strong>{' '}
            <SeverityBadge score={inspection.severityScore} />
          </p>
        ) : (
          <p>No inspection on record before this visit.</p>
        )}
      </div>

      <footer className="visit-item__actions">
        {confirming ? (
          <>
            <span>Delete this visit?</span>
            <button type="button" className="btn btn--small btn--primary" onClick={onDelete}>
              Yes, delete
            </button>
            <button
              type="button"
              className="btn btn--small btn--ghost"
              onClick={() => setConfirming(false)}
            >
              Keep
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn--small btn--ghost" onClick={onEdit}>
              Edit
            </button>
            <button
              type="button"
              className="btn btn--small btn--ghost"
              onClick={() => setConfirming(true)}
            >
              Delete
            </button>
          </>
        )}
      </footer>
    </article>
  );
}

VisitItem.propTypes = {
  visit: visitShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

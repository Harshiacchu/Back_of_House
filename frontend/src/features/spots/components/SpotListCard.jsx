import PropTypes from 'prop-types';
import { useState } from 'react';

import SpotItem from './SpotItem.jsx';
import { formatDate } from '../../../utils/format.js';
import { spotListShape } from '../spotShapes.js';
import './SpotListCard.css';

// One saved list with its restaurants, and Edit / Delete for the list.
export default function SpotListCard({ list, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const count = list.items.length;

  return (
    <article className="spot-list-card">
      <header className="spot-list-card__header">
        <div className="spot-list-card__heading">
          <h2 className="spot-list-card__name">{list.name}</h2>
          {list.description && <p className="spot-list-card__description">{list.description}</p>}
          <p className="spot-list-card__meta">
            {count} {count === 1 ? 'restaurant' : 'restaurants'} · Updated{' '}
            {formatDate(list.updatedAt)}
          </p>
        </div>
        <div className="spot-list-card__actions">
          {confirming ? (
            <>
              <span>Delete this list?</span>
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
        </div>
      </header>

      {count === 0 ? (
        <p className="spot-list-card__empty">No restaurants yet. Edit the list to add some.</p>
      ) : (
        <ul className="spot-list-card__items">
          {list.items.map((item) => (
            <li key={item.restaurant._id}>
              <SpotItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

SpotListCard.propTypes = {
  list: spotListShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

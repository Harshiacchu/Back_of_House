import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { formatDate } from '../../../utils/format.js';
import { pollShape } from '../pollShapes.js';
import './PollCard.css';

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

// One poll in the list. Only the creator sees Edit and Delete.
export default function PollCard({ poll, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <article className="poll-card">
      <header className="poll-card__header">
        <span>{poll.isCreator ? 'You asked' : `${poll.creatorName} asked`}</span>
        <span>{formatDate(poll.updatedAt)}</span>
      </header>

      <h3 className="poll-card__title">
        <Link to={`/polls/${poll._id}`}>{poll.title}</Link>
      </h3>

      <ul className="poll-card__candidates">
        {poll.restaurants.map((restaurant) => (
          <li key={restaurant._id}>{restaurant.name}</li>
        ))}
      </ul>

      <p className="poll-card__votes">{plural(poll.totalVotes, 'vote')} so far</p>

      <footer className="poll-card__actions">
        {confirming ? (
          <>
            <span>Delete this poll for everyone?</span>
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
            <Link to={`/polls/${poll._id}`} className="link-more poll-card__open">
              Compare and vote
            </Link>
            {poll.isCreator && (
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
          </>
        )}
      </footer>
    </article>
  );
}

PollCard.propTypes = {
  poll: pollShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

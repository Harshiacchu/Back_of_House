import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import VoteButton from './VoteButton.jsx';
import SeverityBadge from '../../../components/SeverityBadge.jsx';
import TrajectoryBadge from '../../../components/TrajectoryBadge.jsx';
import { formatDate } from '../../../utils/format.js';
import { candidateShape } from '../pollShapes.js';
import './ComparisonColumn.css';

// One restaurant in the side-by-side comparison: its kitchen, its votes, and a vote button.
export default function ComparisonColumn({
  candidate,
  totalVotes,
  isMyVote,
  isCleanest,
  isLeading,
  voting,
  onVote,
}) {
  const { restaurant, voteCount, voterNames } = candidate;
  const { summary = {} } = restaurant;
  const share = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

  return (
    <article className={`comparison-column${isMyVote ? ' comparison-column--mine' : ''}`}>
      <header className="comparison-column__header">
        <ul className="comparison-column__tags" aria-label="Highlights">
          {isLeading && <li className="comparison-column__tag">Most votes</li>}
          {isCleanest && (
            <li className="comparison-column__tag comparison-column__tag--clean">
              Cleanest kitchen
            </li>
          )}
        </ul>
        <span className="comparison-column__hood">{restaurant.neighborhood || 'Boston'}</span>
        <h3 className="comparison-column__name">
          <Link to={`/restaurants/${restaurant._id}`}>{restaurant.name}</Link>
        </h3>
        {restaurant.address && (
          <span className="comparison-column__address">{restaurant.address}</span>
        )}
      </header>

      <dl className="comparison-column__facts">
        <div>
          <dt>Severity</dt>
          <dd>
            {summary.severityScore == null ? (
              'No score yet'
            ) : (
              <SeverityBadge score={summary.severityScore} />
            )}
          </dd>
        </div>
        <div>
          <dt>Trend</dt>
          <dd>
            {summary.trajectory ? (
              <TrajectoryBadge trajectory={summary.trajectory} />
            ) : (
              'Too few inspections'
            )}
          </dd>
        </div>
        <div>
          <dt>Last inspection</dt>
          <dd>
            {formatDate(summary.lastInspectionDate)}
            {summary.lastResult && (
              <span className="comparison-column__result">{summary.lastResult}</span>
            )}
          </dd>
        </div>
      </dl>

      <div className="comparison-column__votes">
        <p className="comparison-column__count">
          <strong>{voteCount}</strong> {voteCount === 1 ? 'vote' : 'votes'}
        </p>
        <meter
          className="comparison-column__meter"
          min={0}
          max={100}
          value={share}
          aria-label={`${share}% of votes`}
        />
        <p className="comparison-column__voters">
          {voterNames.length > 0 ? voterNames.join(', ') : 'No votes yet'}
        </p>
      </div>

      <VoteButton
        restaurantName={restaurant.name}
        isMyVote={isMyVote}
        disabled={voting}
        onVote={onVote}
      />
    </article>
  );
}

ComparisonColumn.propTypes = {
  candidate: candidateShape.isRequired,
  totalVotes: PropTypes.number.isRequired,
  isMyVote: PropTypes.bool.isRequired,
  isCleanest: PropTypes.bool.isRequired,
  isLeading: PropTypes.bool.isRequired,
  voting: PropTypes.bool.isRequired,
  onVote: PropTypes.func.isRequired,
};

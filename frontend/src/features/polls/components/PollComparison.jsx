import PropTypes from 'prop-types';

import ComparisonColumn from './ComparisonColumn.jsx';
import { candidateShape } from '../pollShapes.js';
import './PollComparison.css';

// Every candidate side by side, flagging the cleanest kitchen and the current leader.
export default function PollComparison({ candidates, totalVotes, myVote, voting, onVote }) {
  const scores = candidates
    .map((c) => c.restaurant.summary?.severityScore)
    .filter((score) => score != null);
  const cleanest = scores.length > 0 ? Math.min(...scores) : null;
  const mostVotes = Math.max(0, ...candidates.map((c) => c.voteCount));

  return (
    <ul className="poll-comparison" style={{ '--columns': candidates.length }}>
      {candidates.map((candidate) => (
        <li key={candidate.restaurant._id}>
          <ComparisonColumn
            candidate={candidate}
            totalVotes={totalVotes}
            isMyVote={candidate.restaurant._id === myVote}
            isCleanest={
              cleanest !== null && candidate.restaurant.summary?.severityScore === cleanest
            }
            isLeading={mostVotes > 0 && candidate.voteCount === mostVotes}
            voting={voting}
            onVote={() => onVote(candidate.restaurant._id)}
          />
        </li>
      ))}
    </ul>
  );
}

PollComparison.propTypes = {
  candidates: PropTypes.arrayOf(candidateShape).isRequired,
  totalVotes: PropTypes.number.isRequired,
  myVote: PropTypes.string,
  voting: PropTypes.bool.isRequired,
  onVote: PropTypes.func.isRequired,
};

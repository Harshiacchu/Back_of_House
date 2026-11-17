import PropTypes from 'prop-types';

import './VoteButton.css';

// Vote for one candidate. Pressed when it's the user's current pick.
export default function VoteButton({ restaurantName, isMyVote, disabled, onVote }) {
  return (
    <button
      type="button"
      className={`btn vote-button ${isMyVote ? 'vote-button--chosen' : 'btn--secondary'}`}
      aria-pressed={isMyVote}
      aria-label={isMyVote ? `Your vote: ${restaurantName}` : `Vote for ${restaurantName}`}
      disabled={disabled || isMyVote}
      onClick={onVote}
    >
      {isMyVote ? '✓ Your pick' : 'Vote for this'}
    </button>
  );
}

VoteButton.propTypes = {
  restaurantName: PropTypes.string.isRequired,
  isMyVote: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onVote: PropTypes.func.isRequired,
};

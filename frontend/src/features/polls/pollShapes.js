import PropTypes from 'prop-types';

import { restaurantSummaryShape } from '../../utils/propShapes.js';

// Shapes for the /api/polls responses (see backend/src/features/polls/polls.routes.js).
export const restaurantNameShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const pollShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  creatorName: PropTypes.string,
  isCreator: PropTypes.bool.isRequired,
  totalVotes: PropTypes.number.isRequired,
  updatedAt: PropTypes.string,
  restaurants: PropTypes.arrayOf(restaurantNameShape),
});

export const candidateShape = PropTypes.shape({
  restaurant: restaurantSummaryShape.isRequired,
  voteCount: PropTypes.number.isRequired,
  voterNames: PropTypes.arrayOf(PropTypes.string).isRequired,
});

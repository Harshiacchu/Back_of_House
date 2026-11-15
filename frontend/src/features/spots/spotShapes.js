import PropTypes from 'prop-types';

import { restaurantSummaryShape } from '../../utils/propShapes.js';

// Shapes for the /api/spots responses (see backend/src/features/spots/spots.routes.js).
export const spotItemShape = PropTypes.shape({
  restaurant: restaurantSummaryShape.isRequired,
  note: PropTypes.string,
  addedAt: PropTypes.string,
});

export const spotListShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  items: PropTypes.arrayOf(spotItemShape).isRequired,
  updatedAt: PropTypes.string,
});

// A row in the list form: just enough to show the name and edit the note.
export const draftItemShape = PropTypes.shape({
  restaurant: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  note: PropTypes.string.isRequired,
});

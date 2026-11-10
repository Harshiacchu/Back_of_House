import PropTypes from 'prop-types';

// Shared PropTypes shapes, matching the backend's public contracts (docs/PROJECT_PLAN.md §3).
export const TRAJECTORIES = ['Improving', 'Steady', 'Slipping'];
export const VIOLATION_LEVELS = ['Minor', 'Moderate', 'Serious'];

export const restaurantSummaryShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string,
  neighborhood: PropTypes.string,
  summary: PropTypes.shape({
    severityScore: PropTypes.number,
    trajectory: PropTypes.oneOf(TRAJECTORIES),
    lastInspectionDate: PropTypes.string,
    lastResult: PropTypes.string,
  }),
});

export const violationShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  level: PropTypes.oneOf(VIOLATION_LEVELS).isRequired,
  plain: PropTypes.string.isRequired,
  category: PropTypes.string,
  description: PropTypes.string,
  comments: PropTypes.string,
});

export const inspectionShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  result: PropTypes.string,
  severityScore: PropTypes.number.isRequired,
  violations: PropTypes.arrayOf(violationShape).isRequired,
});

export const visitShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  restaurant: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    neighborhood: PropTypes.string,
  }).isRequired,
  visitDate: PropTypes.string.isRequired,
  dish: PropTypes.string,
  rating: PropTypes.number,
  notes: PropTypes.string,
  inspectionAtVisit: PropTypes.shape({
    date: PropTypes.string,
    result: PropTypes.string,
    severityScore: PropTypes.number,
  }),
});

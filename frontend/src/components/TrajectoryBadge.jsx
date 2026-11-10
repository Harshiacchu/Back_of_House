import PropTypes from 'prop-types';

import { TRAJECTORIES } from '../utils/propShapes.js';
import './TrajectoryBadge.css';

const ARROWS = { Improving: '↗', Steady: '→', Slipping: '↘' };

// Shared by Kitchen Reports, Visit Log, Group Picks and My Spots.
export default function TrajectoryBadge({ trajectory }) {
  return (
    <span className={`trajectory-badge trajectory-badge--${trajectory.toLowerCase()}`}>
      <span aria-hidden="true">{ARROWS[trajectory]}</span> {trajectory}
    </span>
  );
}

TrajectoryBadge.propTypes = {
  trajectory: PropTypes.oneOf(TRAJECTORIES).isRequired,
};

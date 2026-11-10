import PropTypes from 'prop-types';

import TrajectoryBadge from '../../../components/TrajectoryBadge.jsx';
import { formatDate } from '../../../utils/format.js';
import { TRAJECTORIES } from '../../../utils/propShapes.js';
import './TrajectoryChart.css';

const W = 320;
const H = 110;
const PAD = 10;

// Severity of each inspection over time (oldest left). Plotted so up = cleaner.
export default function TrajectoryChart({ points, trajectory }) {
  // Scale to this kitchen's own range (at least 0-40) so small changes stay visible.
  const top = Math.max(40, ...points.map((p) => p.score)) * 1.1;
  const coords = points.map((p, i) => {
    const x = points.length === 1 ? W / 2 : PAD + (i * (W - 2 * PAD)) / (points.length - 1);
    const y = PAD + ((H - 2 * PAD) * Math.min(top, p.score)) / top;
    return { ...p, x, y };
  });
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <figure className="trajectory-chart">
      <figcaption className="trajectory-chart__caption">
        <span className="eyebrow">Trajectory</span>
        {trajectory && <TrajectoryBadge trajectory={trajectory} />}
      </figcaption>
      {coords.length > 0 ? (
        <svg
          className={`trajectory-chart__svg trajectory-chart__svg--${(trajectory || 'steady').toLowerCase()}`}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Severity went from ${first.score} on ${formatDate(first.date)} to ${last.score} on ${formatDate(last.date)}`}
        >
          <line className="trajectory-chart__mid" x1="0" x2={W} y1={H / 2} y2={H / 2} />
          <polyline points={coords.map((c) => `${c.x},${c.y}`).join(' ')} />
          {coords.map((c) => (
            <circle key={c.date} cx={c.x} cy={c.y} r="4.5" />
          ))}
        </svg>
      ) : (
        <p className="trajectory-chart__empty">Not enough inspections yet.</p>
      )}
      <p className="trajectory-chart__hint">
        Last {points.length} inspection{points.length === 1 ? '' : 's'}. Higher means cleaner.
      </p>
    </figure>
  );
}

TrajectoryChart.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({ date: PropTypes.string.isRequired, score: PropTypes.number.isRequired }),
  ).isRequired,
  trajectory: PropTypes.oneOf(TRAJECTORIES),
};

import PropTypes from 'prop-types';

import { severityLevel, shortSeverityLabel } from '../utils/severity.js';
import './SeverityBadge.css';

// Score chip, e.g. "34 · Concerns". Shared by every feature.
export default function SeverityBadge({ score }) {
  return (
    <span
      className={`severity-badge severity-badge--${severityLevel(score)}`}
      title="Severity score, 0 (clean) to 100"
    >
      <strong>{score}</strong>
      <span aria-hidden="true">·</span>
      {shortSeverityLabel(score)}
      <span className="visually-hidden"> (severity score out of 100)</span>
    </span>
  );
}

SeverityBadge.propTypes = {
  score: PropTypes.number.isRequired,
};

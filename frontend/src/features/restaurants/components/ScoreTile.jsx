import PropTypes from 'prop-types';

import { severityLevel, shortSeverityLabel } from '../../../utils/severity.js';
import './ScoreTile.css';

// The coloured score square: the number, and Clean / Minor / Concerns / Serious under it.
export default function ScoreTile({ score, size = 'medium' }) {
  return (
    <span className={`score-tile score-tile--${size} score-tile--level-${severityLevel(score)}`}>
      <span className="visually-hidden">Severity score </span>
      <strong>{score}</strong>
      <span className="score-tile__label">{shortSeverityLabel(score)}</span>
    </span>
  );
}

ScoreTile.propTypes = {
  score: PropTypes.number.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

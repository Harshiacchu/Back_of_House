import PropTypes from 'prop-types';

import { SEVERITY_LABELS, severityLevel } from '../../../utils/severity.js';
import './SeverityMeter.css';

// A 0-100 thermometer-style scale with the score marked on it.
export default function SeverityMeter({ score }) {
  const level = severityLevel(score);
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <figure className={`severity-meter severity-meter--${level}`}>
      <figcaption className="severity-meter__caption">
        <span className="eyebrow">Severity</span>
        <span className="severity-meter__score">
          {score}
          <span className="severity-meter__max">/100</span>
        </span>
        <span className="severity-meter__label">{SEVERITY_LABELS[level]}</span>
      </figcaption>
      <div
        className="severity-meter__track"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label="Severity score"
      >
        <span className="severity-meter__marker" style={{ left: `${clamped}%` }} />
      </div>
      <div className="severity-meter__scale" aria-hidden="true">
        <span>Minor</span>
        <span>Concerns</span>
        <span>Serious</span>
      </div>
    </figure>
  );
}

SeverityMeter.propTypes = {
  score: PropTypes.number.isRequired,
};

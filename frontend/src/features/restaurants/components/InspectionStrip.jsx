import PropTypes from 'prop-types';

import { severityLevel } from '../../../utils/severity.js';
import './InspectionStrip.css';

// One bar per recent inspection, oldest to newest: taller and redder means more serious.
export default function InspectionStrip({ scores }) {
  if (!scores?.length) return null;
  const count = scores.length;
  return (
    <figure className="inspection-strip">
      <span
        className="inspection-strip__bars"
        role="img"
        aria-label={`Severity of the last ${count} inspections, oldest to newest: ${scores.join(', ')} out of 100`}
      >
        {scores.map((score, i) => (
          <span
            // Scores repeat, and the list never reorders, so position is the identity here.
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={`inspection-strip__bar inspection-strip__bar--${severityLevel(score)}`}
            style={{ '--bar': `${Math.max(14, score)}%` }}
          />
        ))}
      </span>
      <figcaption className="inspection-strip__caption">
        Last {count} inspection{count === 1 ? '' : 's'}
      </figcaption>
    </figure>
  );
}

InspectionStrip.propTypes = {
  scores: PropTypes.arrayOf(PropTypes.number),
};

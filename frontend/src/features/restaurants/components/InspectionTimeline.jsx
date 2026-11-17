import PropTypes from 'prop-types';

import { formatDate } from '../../../utils/format.js';
import { inspectionShape } from '../../../utils/propShapes.js';
import { severityLevel } from '../../../utils/severity.js';
import './InspectionTimeline.css';

const year = (value) => new Date(value).getUTCFullYear();

// Every inspection as a bar, oldest on the left; taller and redder = more problems.
// Each bar is a button that shows that inspection below.
export default function InspectionTimeline({ inspections, selectedId, onSelect }) {
  const oldestFirst = [...inspections].reverse();
  const top = Math.max(40, ...oldestFirst.map((i) => i.severityScore));

  return (
    <div className="inspection-timeline">
      <div
        className="inspection-timeline__bars"
        role="group"
        aria-label="Inspections, oldest first"
      >
        {oldestFirst.map((inspection, i) => {
          const newYear = i === 0 || year(inspection.date) !== year(oldestFirst[i - 1].date);
          return (
            <div key={inspection._id} className="inspection-timeline__slot">
              <button
                type="button"
                className={`inspection-timeline__bar inspection-timeline__bar--${severityLevel(inspection.severityScore)}`}
                style={{ '--bar': `${Math.max(6, (inspection.severityScore / top) * 100)}%` }}
                aria-pressed={inspection._id === selectedId}
                onClick={() => onSelect(inspection._id)}
              >
                <span className="visually-hidden">
                  {formatDate(inspection.date)}: {inspection.result}, score{' '}
                  {inspection.severityScore}
                </span>
              </button>
              <span className="inspection-timeline__year" aria-hidden="true">
                {newYear ? year(inspection.date) : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

InspectionTimeline.propTypes = {
  inspections: PropTypes.arrayOf(inspectionShape).isRequired,
  selectedId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

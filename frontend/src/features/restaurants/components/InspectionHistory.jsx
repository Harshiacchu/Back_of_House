import PropTypes from 'prop-types';

import ViolationList from './ViolationList.jsx';
import SeverityBadge from '../../../components/SeverityBadge.jsx';
import { formatDate } from '../../../utils/format.js';
import { inspectionShape } from '../../../utils/propShapes.js';
import './InspectionHistory.css';

// Every inspection, newest first; the latest one starts open.
export default function InspectionHistory({ inspections }) {
  return (
    <ol className="inspection-history">
      {inspections.map((inspection, i) => (
        <li key={inspection._id} className="inspection-history__item">
          <details open={i === 0}>
            <summary className="inspection-history__summary">
              <span className="inspection-history__date">{formatDate(inspection.date)}</span>
              <span className="inspection-history__result">{inspection.result || 'Inspected'}</span>
              <SeverityBadge score={inspection.severityScore} />
              <span className="inspection-history__count">
                {inspection.violations.length} issue{inspection.violations.length === 1 ? '' : 's'}
              </span>
            </summary>
            <ViolationList violations={inspection.violations} />
          </details>
        </li>
      ))}
    </ol>
  );
}

InspectionHistory.propTypes = {
  inspections: PropTypes.arrayOf(inspectionShape).isRequired,
};

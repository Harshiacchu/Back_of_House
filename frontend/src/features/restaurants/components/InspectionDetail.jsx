import { useState } from 'react';

import { formatDate } from '../../../utils/format.js';
import { inspectionShape } from '../../../utils/propShapes.js';
import ScoreTile from './ScoreTile.jsx';
import ViolationList from './ViolationList.jsx';
import './InspectionDetail.css';

const FIRST = 6;
const LEVEL_ORDER = { Serious: 0, Moderate: 1, Minor: 2 };

// One inspection, decoded: when, the result, and its violations, most serious first.
export default function InspectionDetail({ inspection }) {
  const [showAll, setShowAll] = useState(false);
  const sorted = [...inspection.violations].sort(
    (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level],
  );
  const count = sorted.length;
  const shown = showAll ? sorted : sorted.slice(0, FIRST);
  const serious = sorted.filter((v) => v.level === 'Serious').length;

  return (
    <article className="inspection-detail" aria-live="polite">
      <header className="inspection-detail__header">
        <ScoreTile score={inspection.severityScore} size="small" />
        <div>
          <h3 className="inspection-detail__date">{formatDate(inspection.date)}</h3>
          <p className="inspection-detail__result">
            {inspection.result || 'Inspected'} · {count} issue{count === 1 ? '' : 's'} found
            {serious > 0 && `, ${serious} serious`}
          </p>
        </div>
      </header>
      <ViolationList violations={shown} />
      {count > FIRST && (
        <button
          type="button"
          className="btn btn--ghost inspection-detail__more"
          onClick={() => setShowAll((open) => !open)}
        >
          {showAll ? 'Show fewer' : `Show all ${count} issues`}
        </button>
      )}
    </article>
  );
}

InspectionDetail.propTypes = {
  inspection: inspectionShape.isRequired,
};

import PropTypes from 'prop-types';

import { formatDate } from '../../../utils/format.js';
import { problemAreas, timeAgo } from '../../../utils/inspections.js';
import { inspectionShape } from '../../../utils/propShapes.js';
import { categoryLabel } from '../../../utils/severity.js';
import './ProblemAreas.css';

// What keeps coming up at this kitchen: each kind of problem, how often, and how long ago.
export default function ProblemAreas({ inspections }) {
  const { cited, never } = problemAreas(inspections);
  const most = Math.max(1, ...cited.map((c) => c.count));

  return (
    <div className="problem-areas">
      {cited.length > 0 ? (
        <ul className="problem-areas__list">
          {cited.map((area) => (
            <li key={area.key} className="problem-areas__row">
              <span className="problem-areas__name">{categoryLabel(area.key)}</span>
              <span className="problem-areas__bar" aria-hidden="true">
                <span style={{ '--share': `${(area.count / most) * 100}%` }} />
              </span>
              <span className="problem-areas__count">
                {area.count} time{area.count === 1 ? '' : 's'}
              </span>
              <span className="problem-areas__when">
                Last {timeAgo(area.last)}
                <span className="visually-hidden"> ({formatDate(area.last)})</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="problem-areas__clean">Never cited for anything. A spotless record.</p>
      )}
      {never.length > 0 && cited.length > 0 && (
        <div className="problem-areas__never">
          <span>Never cited for</span>
          <ul>
            {never.map((key) => (
              <li key={key}>{categoryLabel(key)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

ProblemAreas.propTypes = {
  inspections: PropTypes.arrayOf(inspectionShape).isRequired,
};

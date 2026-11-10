import PropTypes from 'prop-types';

import { violationShape } from '../../../utils/propShapes.js';
import { categoryLabel } from '../../../utils/severity.js';
import './ViolationList.css';

export default function ViolationList({ violations }) {
  if (violations.length === 0) {
    return <p className="violation-list__clean">No violations recorded. A clean visit.</p>;
  }
  return (
    <ul className="violation-list">
      {violations.map((v) => (
        <li key={`${v.code}-${v.plain}`} className="violation-list__item">
          <span className={`violation-list__level violation-list__level--${v.level.toLowerCase()}`}>
            {v.level}
          </span>
          <div className="violation-list__body">
            <p className="violation-list__plain">{v.plain}</p>
            <p className="violation-list__meta">
              {v.category && <span>{categoryLabel(v.category)}</span>}
              <code>{v.code}</code>
            </p>
            {v.comments && <p className="violation-list__comments">“{v.comments}”</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

ViolationList.propTypes = {
  violations: PropTypes.arrayOf(violationShape).isRequired,
};

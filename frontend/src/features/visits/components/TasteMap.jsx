import PropTypes from 'prop-types';

import { shortSeverityLabel } from '../../../utils/severity.js';
import { visitShape } from '../../../utils/propShapes.js';
import { QUADRANTS, plotVisits, quadrantOf } from '../tasteQuadrants.js';
import './TasteMap.css';

// Every visit as a dot: how much you liked the food (left to right) against how clean the
// kitchen was that day (top to bottom). The four corners name what kind of place it was.
export default function TasteMap({ visits, quadrant, selectedId, onSelect }) {
  const dots = plotVisits(visits);

  return (
    <figure className="taste-map">
      <figcaption className="taste-map__caption">
        <span className="taste-map__eyebrow">Taste × Kitchen</span>
        <span>Each dot is a meal. Pick one to jump to it in your log.</span>
      </figcaption>

      <div className="taste-map__plot">
        <span className="taste-map__axis taste-map__axis--x" aria-hidden="true" />
        <span className="taste-map__axis taste-map__axis--y" aria-hidden="true" />
        {QUADRANTS.map((q) => (
          <span
            key={q.key}
            className={`taste-map__zone taste-map__zone--${q.key}${
              quadrant === q.key ? ' taste-map__zone--active' : ''
            }`}
            aria-hidden="true"
          >
            {q.label}
          </span>
        ))}

        {dots.map(({ visit, level, x, y, dx, dy }) => {
          const score = visit.inspectionAtVisit.severityScore;
          const dimmed = quadrant !== 'all' && quadrantOf(visit) !== quadrant;
          const selected = visit._id === selectedId;
          return (
            <button
              key={visit._id}
              type="button"
              className={`taste-map__dot taste-map__dot--${level}${
                dimmed ? ' taste-map__dot--dimmed' : ''
              }${selected ? ' taste-map__dot--selected' : ''}`}
              style={{ left: `calc(${x}% + ${dx}px)`, top: `calc(${y}% + ${dy}px)` }}
              aria-pressed={selected}
              aria-label={`${visit.restaurant.name}: ${visit.rating} stars, kitchen ${score} (${shortSeverityLabel(score)})`}
              onClick={() => onSelect(visit)}
            >
              <span className="taste-map__label" aria-hidden="true">
                {visit.restaurant.name}
              </span>
            </button>
          );
        })}

        <span className="taste-map__tick taste-map__tick--left" aria-hidden="true">
          ★ Meh
        </span>
        <span className="taste-map__tick taste-map__tick--right" aria-hidden="true">
          Loved it ★★★★★
        </span>
        <span className="taste-map__tick taste-map__tick--top" aria-hidden="true">
          Clean kitchen
        </span>
        <span className="taste-map__tick taste-map__tick--bottom" aria-hidden="true">
          Concerns
        </span>
      </div>
    </figure>
  );
}

TasteMap.propTypes = {
  visits: PropTypes.arrayOf(visitShape).isRequired,
  quadrant: PropTypes.string.isRequired,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

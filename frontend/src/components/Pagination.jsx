import PropTypes from 'prop-types';

import './Pagination.css';

// Previous / Next with a "11–20 of 3,334" range. Works with cursor (keyset) pagination: the
// caller only needs to know whether there is a page before and after this one.
export default function Pagination({ from, to, total, hasPrevious, hasNext, onPrevious, onNext }) {
  if (!hasPrevious && !hasNext) return null;
  return (
    <nav className="pagination" aria-label="Pages">
      <button
        type="button"
        className="btn btn--ghost btn--small"
        disabled={!hasPrevious}
        onClick={onPrevious}
      >
        ← Previous
      </button>
      <span className="pagination__status" aria-live="polite">
        {from.toLocaleString()}–{to.toLocaleString()}
        {total != null && ` of ${total.toLocaleString()}`}
      </span>
      <button
        type="button"
        className="btn btn--ghost btn--small"
        disabled={!hasNext}
        onClick={onNext}
      >
        Next →
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
  total: PropTypes.number,
  hasPrevious: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

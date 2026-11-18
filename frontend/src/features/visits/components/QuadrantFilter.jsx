import PropTypes from 'prop-types';

import './QuadrantFilter.css';

// "All · Keepers · Worth a second look …" toggle buttons that filter the log.
export default function QuadrantFilter({ options, value, onChange }) {
  return (
    <div className="quadrant-filter" role="group" aria-label="Filter visits by taste and kitchen">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          className="quadrant-filter__option"
          aria-pressed={value === option.key}
          title={option.hint}
          onClick={() => onChange(option.key)}
        >
          {option.label}
          <span className="quadrant-filter__count">{option.count}</span>
        </button>
      ))}
    </div>
  );
}

QuadrantFilter.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      hint: PropTypes.string,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

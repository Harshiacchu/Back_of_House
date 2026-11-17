import PropTypes from 'prop-types';
import { useId } from 'react';

import './QuarterScrubber.css';

// Timeline under the map: one bar per quarter (height = kitchens with real concerns), a range
// slider on top to pick a quarter, and Play to step through them.
export default function QuarterScrubber({ quarters, index, onChange, playing, onTogglePlay }) {
  const sliderId = useId();
  const most = Math.max(1, ...quarters.map((q) => q.concerns));
  const last = quarters.length - 1;

  return (
    <div className="quarter-scrubber">
      <button
        type="button"
        className="quarter-scrubber__play"
        aria-pressed={playing}
        onClick={onTogglePlay}
      >
        <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
        <span className="visually-hidden">{playing ? 'Pause' : 'Play through the quarters'}</span>
      </button>
      <div className="quarter-scrubber__track">
        <label htmlFor={sliderId} className="visually-hidden">
          Quarter
        </label>
        <div className="quarter-scrubber__bars" aria-hidden="true">
          {quarters.map((q, i) => (
            <span
              key={q.label}
              className={`quarter-scrubber__bar${i === index ? ' quarter-scrubber__bar--on' : ''}`}
              style={{ '--bar': `${(q.concerns / most) * 100}%` }}
            />
          ))}
        </div>
        <input
          id={sliderId}
          type="range"
          className="quarter-scrubber__range"
          min="0"
          max={last}
          value={index}
          aria-valuetext={quarters[index].title}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="quarter-scrubber__ends" aria-hidden="true">
          <span>{quarters[0].label}</span>
          <span>{quarters[last].label}</span>
        </div>
      </div>
    </div>
  );
}

QuarterScrubber.propTypes = {
  quarters: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      concerns: PropTypes.number.isRequired,
    }),
  ).isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  playing: PropTypes.bool.isRequired,
  onTogglePlay: PropTypes.func.isRequired,
};

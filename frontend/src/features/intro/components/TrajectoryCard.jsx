import { useState } from 'react';

import './TrajectoryCard.css';

const W = 520;
const H = 220;
const PAD = 18;

const SERIES = {
  Improving: { scores: [58, 49, 44, 37, 30, 22], caption: 'Fewer problems every visit.' },
  Steady: { scores: [24, 27, 23, 26, 24, 25], caption: 'Same kitchen, every time.' },
  Slipping: { scores: [14, 18, 27, 33, 42, 55], caption: 'Getting worse. Worth a second look.' },
};

const yFor = (score) => PAD + ((H - 2 * PAD) * score) / 70;

function toPath(scores) {
  return scores
    .map((s, i) => {
      const x = PAD + (i * (W - 2 * PAD)) / (scores.length - 1);
      return `${i ? 'L' : 'M'}${x.toFixed(1)} ${yFor(s).toFixed(1)}`;
    })
    .join(' ');
}

// Interactive example: switch between the three trajectories.
export default function TrajectoryCard() {
  const [mode, setMode] = useState('Improving');
  const { scores, caption } = SERIES[mode];

  return (
    <article className="trajectory-card" aria-labelledby="trajectory-card-title">
      <p className="eyebrow">Trajectory</p>
      <h3 id="trajectory-card-title" className="trajectory-card__title">
        Know where it’s headed.
      </h3>

      <div className="trajectory-card__toggle" role="group" aria-label="Example trajectory">
        {Object.keys(SERIES).map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={mode === name}
            className="trajectory-card__option"
            onClick={() => setMode(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <svg
        className={`trajectory-card__chart trajectory-card__chart--${mode.toLowerCase()}`}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${mode}: severity went from ${scores[0]} to ${scores[scores.length - 1]} over six inspections`}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} className="trajectory-card__grid" x1="0" x2={W} y1={H * f} y2={H * f} />
        ))}
        <path key={mode} className="trajectory-card__line" d={toPath(scores)} pathLength="1" />
        <circle
          key={`${mode}-dot`}
          className="trajectory-card__dot"
          cx={W - PAD}
          cy={yFor(scores[scores.length - 1])}
          r="7"
        />
      </svg>
      <p className="trajectory-card__caption" aria-live="polite">
        <strong>{mode}.</strong> {caption} <span>Up is cleaner.</span>
      </p>
    </article>
  );
}

TrajectoryCard.propTypes = {};

import { useEffect, useState } from 'react';

import { useInView } from '../../../hooks/useInView.js';
import './SeverityCard.css';

const TARGET = 34;
const DURATION_MS = 1200;

const LEVELS = [
  { tone: 'low', name: 'Minor', range: '0–19', text: 'Signage, paperwork, a missing hair net.' },
  { tone: 'medium', name: 'Concerns', range: '20–49', text: 'Hygiene and equipment problems.' },
  { tone: 'high', name: 'Serious', range: '50–100', text: 'Pests. Unsafe food temperatures.' },
];

export default function SeverityCard() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [score, setScore] = useState(0);

  // Count up to the target once the card is on screen.
  useEffect(() => {
    if (!inView) return undefined;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      setScore(Math.round(TARGET * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return (
    <article ref={ref} className="severity-card" aria-labelledby="severity-card-title">
      <p className="eyebrow">Severity score</p>
      <h3 id="severity-card-title" className="severity-card__title">
        Weighed, not counted.
      </h3>
      <p className="severity-card__score" aria-label={`Example score ${TARGET} out of 100`}>
        {score}
        <span className="severity-card__max">/100</span>
      </p>
      <div className="severity-card__track" aria-hidden="true">
        <span className="severity-card__fill" style={{ width: inView ? `${TARGET}%` : '0%' }} />
      </div>
      <ul className="severity-card__levels">
        {LEVELS.map((level) => (
          <li key={level.name}>
            <span
              className={`severity-card__dot severity-card__dot--${level.tone}`}
              aria-hidden="true"
            />
            <span>
              <strong>{level.name}</strong>{' '}
              <span className="severity-card__range">{level.range}</span>
              <br />
              <span className="severity-card__text">{level.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

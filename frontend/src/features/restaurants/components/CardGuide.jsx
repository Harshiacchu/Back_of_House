import TrajectoryBadge from '../../../components/TrajectoryBadge.jsx';
import InspectionStrip from './InspectionStrip.jsx';
import ScoreTile from './ScoreTile.jsx';
import './CardGuide.css';

const SCORES = [
  { score: 8, text: '0–19: minor issues, like a missing sign or a worn floor.' },
  { score: 34, text: '20–49: real concerns worth knowing about.' },
  { score: 62, text: '50 and up: serious problems, like pests or unsafe food temperatures.' },
];
const EXAMPLE_HISTORY = [4, 0, 58, 12, 6, 32, 2, 0];

// "How to read these cards": what the colours, bars and arrows on each result mean.
export default function CardGuide() {
  return (
    <details className="card-guide" open>
      <summary className="card-guide__summary">How to read these cards</summary>

      <ol className="card-guide__steps">
        <li>
          <strong>Find a place.</strong> Type a name, or pick a neighborhood on the map above.
        </li>
        <li>
          <strong>Narrow it down.</strong> Filter by trend, sort by cleanest, choose how many to
          show.
        </li>
        <li>
          <strong>Open a card</strong> for the full report: every inspection, decoded.
        </li>
      </ol>

      <div className="card-guide__key">
        <section className="card-guide__part" aria-labelledby="guide-score">
          <h3 id="guide-score">The score</h3>
          <p className="card-guide__note">
            Points for every violation. Serious ones count most, and pests and food temperature
            count extra. 0 is spotless.
          </p>
          <ul className="card-guide__scores">
            {SCORES.map(({ score, text }) => (
              <li key={score}>
                <ScoreTile score={score} size="small" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-guide__part" aria-labelledby="guide-bars">
          <h3 id="guide-bars">The bars</h3>
          <p className="card-guide__note">
            One bar per inspection, oldest on the left. Taller and redder means more problems were
            found that day.
          </p>
          <div className="card-guide__example">
            <InspectionStrip scores={EXAMPLE_HISTORY} />
          </div>
        </section>

        <section className="card-guide__part" aria-labelledby="guide-trend">
          <h3 id="guide-trend">The trend</h3>
          <p className="card-guide__note">Recent inspections compared with earlier ones.</p>
          <ul className="card-guide__trends">
            <li>
              <TrajectoryBadge trajectory="Improving" /> getting cleaner
            </li>
            <li>
              <TrajectoryBadge trajectory="Steady" /> about the same
            </li>
            <li>
              <TrajectoryBadge trajectory="Slipping" /> getting worse
            </li>
          </ul>
        </section>
      </div>
    </details>
  );
}

// Takes no props.
CardGuide.propTypes = {};

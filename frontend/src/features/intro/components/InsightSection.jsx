import SeverityCard from './SeverityCard.jsx';
import TrajectoryCard from './TrajectoryCard.jsx';
import Reveal from '../../../components/Reveal.jsx';
import './InsightSection.css';

export default function InsightSection() {
  return (
    <section className="insight" aria-labelledby="insight-title">
      <div className="insight__inner">
        <Reveal className="insight__head">
          <h2 id="insight-title" className="insight__title">
            A pass can hide a mouse.
          </h2>
          <p className="insight__lead">
            Pass or fail tells you almost nothing. We score what the inspector actually found, and
            show you which way the kitchen is going.
          </p>
        </Reveal>
        <div className="insight__grid">
          <Reveal>
            <SeverityCard />
          </Reveal>
          <Reveal delay={120}>
            <TrajectoryCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

InsightSection.propTypes = {};

import { Link } from 'react-router-dom';

import Reveal from '../../../components/Reveal.jsx';
import handsGnocchi from '../../../assets/photos/hands-gnocchi.webp';
import './ClosingCta.css';

const STEPS = [
  'Search Kitchen Reports by name, neighborhood or trajectory.',
  'Open a restaurant to read its decoded inspections.',
  'Sign in to keep a Visit Log and My Spots lists.',
  'Start a Group Pick and share the link.',
];

export default function ClosingCta() {
  return (
    <section
      className="closing"
      aria-labelledby="closing-title"
      style={{ '--closing-photo': `url(${handsGnocchi})` }}
    >
      <Reveal className="closing__inner">
        <h2 id="closing-title" className="closing__title">
          Hungry? Check first.
        </h2>
        <ol className="closing__steps">
          {STEPS.map((step, i) => (
            <li key={step}>
              <span className="closing__number">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <Link to="/restaurants" className="btn btn--primary closing__cta">
          Look up a restaurant
        </Link>
      </Reveal>
    </section>
  );
}

ClosingCta.propTypes = {};

import Reveal from '../../../components/Reveal.jsx';
import cooks1930 from '../../../assets/photos/cooks-1930.webp';
import './DecodeSection.css';

// Sections of the FDA Food Code that Boston inspectors cite, and what they mean.
const SAMPLES = [
  { code: '3-501.16', plain: 'Hot food wasn’t kept hot enough.' },
  { code: '6-501.111', plain: 'Signs of pests in the kitchen.' },
  { code: '5-205.11', plain: 'The hand sink was blocked.' },
  { code: '2-402.11', plain: 'A cook wasn’t wearing a hair restraint.' },
];

export default function DecodeSection() {
  return (
    <section className="decode" aria-labelledby="decode-title">
      <div className="decode__inner">
        <Reveal className="decode__intro">
          <h2 id="decode-title" className="decode__title">
            Decoded.
          </h2>
          <p className="decode__lead">
            Inspection reports are written for inspectors, not for you. We translate every violation
            into a sentence a human can read.
          </p>
          <figure className="decode__photo">
            <img src={cooks1930} alt="Two cooks in white uniforms at a restaurant stove, 1930" />
            <figcaption>
              Kitchens have been inspected for a century. The paperwork shows it.
            </figcaption>
          </figure>
        </Reveal>

        <ul className="decode__rows">
          {SAMPLES.map((sample, i) => (
            <li key={sample.code}>
              <Reveal delay={i * 100} className="decode__row">
                <code className="decode__code">{sample.code}</code>
                <span className="decode__plain">{sample.plain}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

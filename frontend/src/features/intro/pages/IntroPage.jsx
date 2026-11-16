import { Link } from 'react-router-dom';

import heroKitchen from '../../../assets/photos/hero-kitchen.webp';
import Reveal from '../../../components/Reveal.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import ClosingCta from '../components/ClosingCta.jsx';
import DecodeSection from '../components/DecodeSection.jsx';
import FeatureTiles from '../components/FeatureTiles.jsx';
import InsightSection from '../components/InsightSection.jsx';
import PhotoCredits from '../components/PhotoCredits.jsx';
import './IntroPage.css';

export default function IntroPage() {
  useDocumentTitle();

  return (
    <div className="intro">
      <section
        className="intro__hero"
        aria-labelledby="intro-title"
        style={{ '--hero-photo': `url(${heroKitchen})` }}
      >
        <Reveal className="intro__hero-text">
          <p className="intro__eyebrow">Boston health inspections, decoded</p>
          <h1 id="intro-title" className="intro__title">
            See the kitchen before you see the menu.
          </h1>
          <p className="intro__lead">
            Boston inspects every restaurant, then files the results in code nobody reads. We read
            all 900,000+ records so you don’t have to.
          </p>
          <div className="intro__ctas">
            <Link to="/restaurants" className="btn intro__cta">
              Look up a restaurant
            </Link>
            <a href="#decode-title" className="link-more intro__more">
              How it works
            </a>
          </div>
        </Reveal>
      </section>

      <DecodeSection />
      <InsightSection />
      <FeatureTiles />
      <ClosingCta />
      <PhotoCredits />
    </div>
  );
}

IntroPage.propTypes = {};

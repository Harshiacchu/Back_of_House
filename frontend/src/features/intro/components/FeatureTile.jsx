import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './FeatureTile.css';

export default function FeatureTile({ image, imageAlt, label, title, text, to, linkLabel }) {
  return (
    <article className="feature-tile">
      <img className="feature-tile__image" src={image} alt={imageAlt} loading="lazy" />
      <div className="feature-tile__body">
        <p className="eyebrow">{label}</p>
        <h3 className="feature-tile__title">{title}</h3>
        <p className="feature-tile__text">{text}</p>
        <Link to={to} className="link-more">
          {linkLabel}
        </Link>
      </div>
    </article>
  );
}

FeatureTile.propTypes = {
  image: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  linkLabel: PropTypes.string.isRequired,
};

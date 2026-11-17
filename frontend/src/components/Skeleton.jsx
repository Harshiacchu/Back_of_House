import PropTypes from 'prop-types';

import './Skeleton.css';

// A grey shimmer block standing in for content that is still loading. Purely visual: the
// surrounding list or region carries aria-busy and a hidden "Loading" label.
export default function Skeleton({ width = '100%', height = '1em', round = false }) {
  return (
    <span
      className={`skeleton${round ? ' skeleton--round' : ''}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

Skeleton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  round: PropTypes.bool,
};

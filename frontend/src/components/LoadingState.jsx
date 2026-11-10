import PropTypes from 'prop-types';

import './LoadingState.css';

export default function LoadingState({ label = 'Loading…' }) {
  return <output className="loading-state">{label}</output>;
}

LoadingState.propTypes = {
  label: PropTypes.string,
};

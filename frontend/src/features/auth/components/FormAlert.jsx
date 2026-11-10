import PropTypes from 'prop-types';

import './FormAlert.css';

export default function FormAlert({ tone = 'error', children }) {
  return (
    <p className={`form-alert form-alert--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

FormAlert.propTypes = {
  tone: PropTypes.oneOf(['error', 'info']),
  children: PropTypes.node.isRequired,
};

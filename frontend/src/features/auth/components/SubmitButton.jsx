import PropTypes from 'prop-types';

import './SubmitButton.css';

export default function SubmitButton({ busy, children, busyLabel = 'Please wait…' }) {
  return (
    <button type="submit" className="submit-button" disabled={busy} aria-busy={busy}>
      {busy ? busyLabel : children}
    </button>
  );
}

SubmitButton.propTypes = {
  busy: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  busyLabel: PropTypes.string,
};

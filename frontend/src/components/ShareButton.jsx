import PropTypes from 'prop-types';
import { useState } from 'react';

import { shareOrDownload } from '../utils/shareImage.js';
import './ShareButton.css';

const DONE = { shared: 'Shared', downloaded: 'Saved to your downloads', cancelled: '' };

// Draws an image on demand and opens the share sheet, or downloads it on desktop.
// makeImage: async () => ({ blob, fileName, title }). Nothing is drawn or fetched until clicked.
export default function ShareButton({
  label = 'Share',
  makeImage,
  className = 'btn btn--secondary',
}) {
  const [status, setStatus] = useState({ busy: false, message: '', error: false });

  async function handleClick() {
    setStatus({ busy: true, message: '', error: false });
    try {
      const outcome = await shareOrDownload(await makeImage());
      setStatus({ busy: false, message: DONE[outcome], error: false });
    } catch (err) {
      setStatus({ busy: false, message: err.message || 'Could not share this card', error: true });
    }
  }

  return (
    <span className="share-button">
      <button type="button" className={className} onClick={handleClick} disabled={status.busy}>
        <span aria-hidden="true">↑</span> {status.busy ? 'Preparing…' : label}
      </button>
      <span
        className={`share-button__status${status.error ? ' share-button__status--error' : ''}`}
        role="status"
      >
        {status.message}
      </span>
    </span>
  );
}

ShareButton.propTypes = {
  label: PropTypes.string,
  makeImage: PropTypes.func.isRequired,
  className: PropTypes.string,
};

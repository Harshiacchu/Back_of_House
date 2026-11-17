import { useState } from 'react';

import './ShareLinkButton.css';

// Copies the current page's address so the creator can send it to the group.
export default function ShareLinkButton() {
  const [status, setStatus] = useState('idle');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <div className="share-link">
      <button type="button" className="btn btn--primary" onClick={handleCopy}>
        {status === 'copied' ? '✓ Link copied' : 'Copy share link'}
      </button>
      <output className="share-link__hint">
        {status === 'failed'
          ? `Copy this link: ${window.location.href}`
          : 'Friends sign in, vote once, and can change their pick.'}
      </output>
    </div>
  );
}

ShareLinkButton.propTypes = {};

import PropTypes from 'prop-types';
import { useId, useState } from 'react';

import './PasswordField.css';

// Password input with a show/hide toggle.
export default function PasswordField({ label = 'Password', autoComplete, hint, error }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ');

  return (
    <div className="password-field">
      <label htmlFor={id} className="password-field__label">
        {label}
      </label>
      <div className={error ? 'password-field__box has-error' : 'password-field__box'}>
        <input
          id={id}
          name="password"
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          minLength={8}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
        />
        <button
          type="button"
          className="password-field__toggle"
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="password-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="password-field__error">
          {error}
        </p>
      )}
    </div>
  );
}

PasswordField.propTypes = {
  label: PropTypes.string,
  autoComplete: PropTypes.oneOf(['current-password', 'new-password']).isRequired,
  hint: PropTypes.string,
  error: PropTypes.string,
};

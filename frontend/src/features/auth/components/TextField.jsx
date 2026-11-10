import PropTypes from 'prop-types';
import { useId } from 'react';

import './TextField.css';

export default function TextField({ label, name, type = 'text', autoComplete, error, ...rest }) {
  const id = useId();
  return (
    <div className="text-field">
      <label htmlFor={id} className="text-field__label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        className={error ? 'text-field__input has-error' : 'text-field__input'}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="text-field__error">
          {error}
        </p>
      )}
    </div>
  );
}

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'email']),
  autoComplete: PropTypes.string,
  error: PropTypes.string,
};

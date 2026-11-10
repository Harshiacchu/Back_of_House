import PropTypes from 'prop-types';
import { useRef } from 'react';

import './CodeInput.css';

const LENGTH = 6;

// Six single-digit boxes: auto-advance, backspace to go back, paste a whole code.
export default function CodeInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  invalid = false,
}) {
  const inputs = useRef([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? '');

  function update(next) {
    const clean = next.replace(/\D/g, '').slice(0, LENGTH);
    onChange(clean);
    if (clean.length === LENGTH) onComplete?.(clean);
  }

  function handleChange(index, raw) {
    const typed = raw.replace(/\D/g, '');
    if (!typed) return;
    if (typed.length > 1) {
      update(typed); // pasted or autofilled
      inputs.current[Math.min(typed.length, LENGTH) - 1]?.focus();
      return;
    }
    const next = digits.slice();
    next[index] = typed;
    update(next.join(''));
    inputs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = digits.slice();
      if (next[index]) {
        next[index] = '';
      } else if (index > 0) {
        next[index - 1] = '';
        inputs.current[index - 1]?.focus();
      }
      onChange(next.join('').slice(0, LENGTH));
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    update(pasted);
    inputs.current[Math.min(pasted.replace(/\D/g, '').length, LENGTH) - 1]?.focus();
  }

  return (
    <fieldset className={invalid ? 'code-input is-invalid' : 'code-input'} disabled={disabled}>
      <legend className="visually-hidden">Verification code</legend>
      {digits.map((digit, i) => (
        <input
          // fixed-length array of positions; the index is the identity
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          className="code-input__digit"
          value={digit}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={i === 0 ? LENGTH : 1}
          aria-label={`Digit ${i + 1} of ${LENGTH}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </fieldset>
  );
}

CodeInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
};

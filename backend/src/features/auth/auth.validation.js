import { isNonEmptyString, requireObjectBody, validator } from '../../lib/validation.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CODE = /^\d{6}$/;

export const isEmail = (value) =>
  typeof value === 'string' && value.length <= 254 && EMAIL.test(value.trim());

export function parseRegister(body) {
  const { email, displayName, password } = requireObjectBody(body);
  const v = validator();
  v.check(isNonEmptyString(displayName, 60), 'displayName', 'Enter your name');
  v.check(isEmail(email), 'email', 'Enter a valid email address');
  v.check(
    typeof password === 'string' && password.length >= 8 && password.length <= 128,
    'password',
    'Use at least 8 characters',
  );
  v.done();
  return { email: email.trim(), displayName: displayName.trim(), password };
}

export function parseVerify(body) {
  const { email, code } = requireObjectBody(body);
  const v = validator();
  v.check(isEmail(email), 'email', 'Enter a valid email address');
  v.check(typeof code === 'string' && CODE.test(code), 'code', 'Enter the 6-digit code');
  v.done();
  return { email, code };
}

export function parseEmailOnly(body) {
  const { email } = requireObjectBody(body);
  const v = validator();
  v.check(isEmail(email), 'email', 'Enter a valid email address');
  v.done();
  return { email };
}

// Only allow same-site relative paths as post-login destinations.
export function safeNext(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/restaurants';
}

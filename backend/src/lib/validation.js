import { ObjectId } from 'mongodb';

import { ValidationError, notFound } from './errors.js';

export function isNonEmptyString(value, maxLength = Infinity) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

export function isOptionalString(value, maxLength = Infinity) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.length <= maxLength)
  );
}

export function isIntInRange(value, min, max) {
  return Number.isInteger(value) && value >= min && value <= max;
}

export function isOneOf(value, allowed) {
  return allowed.includes(value);
}

export function isObjectIdString(value) {
  return (
    typeof value === 'string' && ObjectId.isValid(value) && String(new ObjectId(value)) === value
  );
}

// A malformed id is reported as 404, same as a missing document.
export function toObjectId(value, what = 'Resource') {
  if (!isObjectIdString(value)) throw notFound(what);
  return new ObjectId(value);
}

export function parseDate(value) {
  if (value === undefined || value === null || value === '') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function pick(source, keys) {
  return Object.fromEntries(keys.filter((key) => key in source).map((key) => [key, source[key]]));
}

export function requireObjectBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ValidationError({ body: 'Expected a JSON object' });
  }
  return body;
}

// Collects field errors, then throws once:
//   const v = validator(); v.check(cond, 'field', 'message'); v.done();
export function validator() {
  const details = {};
  return {
    check(condition, field, message) {
      if (!condition && !details[field]) details[field] = message;
    },
    done() {
      if (Object.keys(details).length > 0) throw new ValidationError(details);
    },
  };
}

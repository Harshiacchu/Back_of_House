import {
  isIntInRange,
  isObjectIdString,
  isOptionalString,
  requireObjectBody,
  validator,
} from '../../lib/validation.js';

export const MAX_NOTES_LENGTH = 1000;
const MAX_DISH_LENGTH = 120;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

// "2026-11-03" -> Date at 00:00 UTC, or null if it isn't a real calendar day.
function parseDay(value) {
  if (typeof value !== 'string' || !DAY.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return date.toISOString().startsWith(value) ? date : null;
}

export function parseVisitInput(body) {
  const { restaurantId, visitDate, dish = '', rating, notes = '' } = requireObjectBody(body);
  const day = parseDay(visitDate);
  const tomorrow = Date.now() + 24 * 60 * 60 * 1000;

  const v = validator();
  v.check(isObjectIdString(restaurantId), 'restaurantId', 'Pick the restaurant you visited');
  v.check(day !== null, 'visitDate', 'Enter the date of your visit');
  v.check(
    day === null || day.getTime() <= tomorrow,
    'visitDate',
    'The visit can’t be in the future',
  );
  v.check(
    isOptionalString(dish, MAX_DISH_LENGTH),
    'dish',
    `Keep it under ${MAX_DISH_LENGTH} characters`,
  );
  v.check(isIntInRange(rating, 1, 5), 'rating', 'Rate it from 1 to 5 stars');
  v.check(
    isOptionalString(notes, MAX_NOTES_LENGTH),
    'notes',
    `Keep notes under ${MAX_NOTES_LENGTH} characters`,
  );
  v.done();

  return {
    restaurantId,
    visitDate: day,
    dish: (dish ?? '').trim(),
    rating,
    notes: (notes ?? '').trim(),
  };
}

import {
  isNonEmptyString,
  isObjectIdString,
  requireObjectBody,
  validator,
} from '../../lib/validation.js';

export const MIN_CANDIDATES = 2;
export const MAX_CANDIDATES = 5;
const MAX_TITLE_LENGTH = 80;

// { title, restaurantIds: [2-5 distinct ids] } -> trimmed title + de-duplicated ids.
export function parsePollInput(body) {
  const { title, restaurantIds } = requireObjectBody(body);
  const ids = Array.isArray(restaurantIds) ? [...new Set(restaurantIds)] : [];

  const v = validator();
  v.check(isNonEmptyString(title, MAX_TITLE_LENGTH), 'title', 'Give the poll a short title');
  v.check(Array.isArray(restaurantIds), 'restaurantIds', 'Pick the restaurants to vote on');
  v.check(ids.every(isObjectIdString), 'restaurantIds', 'One of the restaurants is not valid');
  v.check(
    ids.length >= MIN_CANDIDATES && ids.length <= MAX_CANDIDATES,
    'restaurantIds',
    `Pick ${MIN_CANDIDATES} to ${MAX_CANDIDATES} different restaurants`,
  );
  v.done();

  return { title: title.trim(), restaurantIds: ids };
}

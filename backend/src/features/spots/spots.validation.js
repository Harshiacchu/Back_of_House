import {
  isNonEmptyString,
  isObjectIdString,
  isOptionalString,
  requireObjectBody,
  validator,
} from '../../lib/validation.js';

const MAX_ITEMS = 50;
const MAX_NAME_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 300;
const MAX_NOTE_LENGTH = 300;

const isItem = (item) =>
  item !== null && typeof item === 'object' && isObjectIdString(item.restaurantId);

// { name, description?, items: [{ restaurantId, note? }] } -> trimmed fields, one item per restaurant.
export function parseSpotListInput(body) {
  const { name, description = '', items = [] } = requireObjectBody(body);
  const list = Array.isArray(items) ? items : [];
  const ids = list.filter(isItem).map((item) => item.restaurantId);

  const v = validator();
  v.check(isNonEmptyString(name, MAX_NAME_LENGTH), 'name', 'Give the list a short name');
  v.check(
    isOptionalString(description, MAX_DESCRIPTION_LENGTH),
    'description',
    `Keep the description under ${MAX_DESCRIPTION_LENGTH} characters`,
  );
  v.check(Array.isArray(items), 'items', 'Items must be a list');
  v.check(list.every(isItem), 'items', 'One of the restaurants is not valid');
  v.check(new Set(ids).size === ids.length, 'items', 'Each restaurant can be on a list only once');
  v.check(list.length <= MAX_ITEMS, 'items', `A list can hold up to ${MAX_ITEMS} restaurants`);
  v.check(
    list.every((item) => isOptionalString(item?.note, MAX_NOTE_LENGTH)),
    'items',
    `Keep each note under ${MAX_NOTE_LENGTH} characters`,
  );
  v.done();

  return {
    name: name.trim(),
    description: (description ?? '').trim(),
    items: list.map((item) => ({
      restaurantId: item.restaurantId,
      note: (item.note ?? '').trim(),
    })),
  };
}

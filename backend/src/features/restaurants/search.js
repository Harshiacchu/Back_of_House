import { badRequest } from '../../lib/errors.js';
import { escapeRegex } from '../../lib/validation.js';

// Words a name is searchable by: "Joe's Café & Bar" -> ['joes', 'cafe', 'bar'].
// The seed stores these on each restaurant; queries are tokenized the same way.
export function toSearchTokens(text) {
  const words = (text ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  return [...new Set(words)];
}

// Every typed word must start one of the name's words, so "fen noo" finds "Fenway Noodle House".
// Anchored regexes on a multikey index are index range scans, not collection scans.
export function nameFilter(query) {
  const words = toSearchTokens(query).slice(0, 5);
  if (words.length === 0) return {};
  return { searchTokens: { $all: words.map((word) => new RegExp(`^${escapeRegex(word)}`)) } };
}

// Keyset ("cursor") pagination: each page starts after the last row of the previous one, so
// page 50 costs the same as page 1. The cursor is the sort value and _id of that last row.
export const SORTS = Object.freeze({
  recent: { field: 'summary.lastInspectionDate', dir: -1, isDate: true },
  cleanest: { field: 'summary.severityScore', dir: 1 },
  name: { field: 'name', dir: 1 },
});

const valueAt = (doc, path) => path.split('.').reduce((value, key) => value?.[key], doc);

export function encodeCursor(doc, sort) {
  const value = valueAt(doc, sort.field);
  const raw = [value instanceof Date ? value.toISOString() : value, String(doc._id)];
  return Buffer.from(JSON.stringify(raw)).toString('base64url');
}

export function afterCursor(cursor, sort, toId) {
  let value;
  let id;
  try {
    [value, id] = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    id = toId(id);
  } catch {
    throw badRequest('This page link has expired. Start the search again.');
  }
  if (sort.isDate) value = new Date(value);
  const op = sort.dir === 1 ? '$gt' : '$lt';
  return {
    $or: [{ [sort.field]: { [op]: value } }, { [sort.field]: value, _id: { [op]: id } }],
  };
}

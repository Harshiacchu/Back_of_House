import { ObjectId } from 'mongodb';

import { SORTS, afterCursor, encodeCursor, nameFilter } from './search.js';
import { getDb } from '../../db/connection.js';
import { COLLECTIONS } from '../../db/collections.js';

export const restaurantsIndexes = {
  [COLLECTIONS.restaurants]: [
    { key: { licenseNo: 1 }, unique: true },
    { key: { searchTokens: 1 } },
    { key: { neighborhood: 1, 'summary.trajectory': 1 } },
    // One per sort order, with _id as the tie-breaker the cursor relies on.
    { key: { 'summary.lastInspectionDate': -1, _id: -1 } },
    { key: { 'summary.severityScore': 1, _id: 1 } },
    { key: { name: 1, _id: 1 } },
  ],
  [COLLECTIONS.inspections]: [{ key: { restaurantId: 1, date: -1 } }],
};

export const restaurants = () => getDb().collection(COLLECTIONS.restaurants);
export const inspections = () => getDb().collection(COLLECTIONS.inspections);

const SUMMARY_PROJECTION = { name: 1, address: 1, neighborhood: 1, summary: 1 };

// PUBLIC CONTRACT (read-only for polls and spots; owned by Harshitha). Keep the shape stable:
// [{ _id, name, address, neighborhood, summary: { severityScore, trajectory, lastInspectionDate, lastResult } }]
export function findSummariesByIds(objectIds) {
  return restaurants()
    .find({ _id: { $in: objectIds } }, { projection: SUMMARY_PROJECTION })
    .toArray();
}

function buildFilter({ q, neighborhood, trajectory }) {
  const filter = nameFilter(q);
  if (neighborhood) filter.neighborhood = neighborhood;
  if (trajectory) filter['summary.trajectory'] = trajectory;
  return filter;
}

// One page of results. `total` is only counted for the first page (no cursor); the client keeps
// it while paging, which saves a count query on every Next.
export async function search({ q, neighborhood, trajectory, sort: sortKey, cursor, limit }) {
  const sort = SORTS[sortKey];
  const base = buildFilter({ q, neighborhood, trajectory });
  const filter = cursor
    ? { $and: [base, afterCursor(cursor, sort, (id) => new ObjectId(id))] }
    : base;

  const [rows, total] = await Promise.all([
    restaurants()
      .find(filter, { projection: SUMMARY_PROJECTION })
      .sort({ [sort.field]: sort.dir, _id: sort.dir })
      .limit(limit + 1)
      .toArray(),
    cursor ? null : restaurants().countDocuments(base),
  ]);

  const items = rows.slice(0, limit);
  const nextCursor = rows.length > limit ? encodeCursor(items.at(-1), sort) : null;
  return { items, total, nextCursor };
}

// Autocomplete: a handful of names for what has been typed so far.
export function suggest(q, limit) {
  const filter = nameFilter(q);
  if (!filter.searchTokens) return Promise.resolve([]);
  return restaurants()
    .find(filter, { projection: { name: 1, neighborhood: 1, 'summary.severityScore': 1 } })
    .sort({ name: 1, _id: 1 })
    .limit(limit)
    .toArray();
}

// Neighborhoods only change when the seed runs, so the list is read once per server process.
let neighborhoodsOnce;
export function listNeighborhoods() {
  neighborhoodsOnce ??= restaurants()
    .distinct('neighborhood')
    .then((names) => names.filter(Boolean).sort())
    .catch((err) => {
      neighborhoodsOnce = undefined;
      throw err;
    });
  return neighborhoodsOnce;
}

export async function findReport(id) {
  const restaurant = await restaurants().findOne(
    { _id: id },
    { projection: { ...SUMMARY_PROJECTION, licenseNo: 1, zip: 1, category: 1 } },
  );
  if (!restaurant) return null;
  const history = await inspections()
    .find({ restaurantId: id }, { projection: { restaurantId: 0, licenseNo: 0 } })
    .sort({ date: -1 })
    .toArray();
  return { restaurant, inspections: history };
}

export function exists(id) {
  return restaurants().countDocuments({ _id: id }, { limit: 1 }).then(Boolean);
}

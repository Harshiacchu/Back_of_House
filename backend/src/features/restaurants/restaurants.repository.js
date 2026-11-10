import { getDb } from '../../db/connection.js';
import { COLLECTIONS } from '../../db/collections.js';
import { escapeRegex } from '../../lib/validation.js';

export const restaurantsIndexes = {
  [COLLECTIONS.restaurants]: [
    { key: { licenseNo: 1 }, unique: true },
    { key: { neighborhood: 1, 'summary.trajectory': 1 } },
    { key: { 'summary.lastInspectionDate': -1 } },
    { key: { name: 1 } },
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

export async function search({ q, neighborhood, trajectory, page, limit }) {
  const filter = {};
  if (q) filter.name = { $regex: escapeRegex(q), $options: 'i' };
  if (neighborhood) filter.neighborhood = neighborhood;
  if (trajectory) filter['summary.trajectory'] = trajectory;
  const sort = q ? { name: 1 } : { 'summary.lastInspectionDate': -1, _id: 1 };

  const [items, total] = await Promise.all([
    restaurants()
      .find(filter, { projection: SUMMARY_PROJECTION })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    restaurants().countDocuments(filter),
  ]);
  return { items, page, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export function listNeighborhoods() {
  return restaurants().distinct('neighborhood');
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

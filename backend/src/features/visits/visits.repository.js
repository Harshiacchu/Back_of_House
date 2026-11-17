import { getDb } from '../../db/connection.js';
import { COLLECTIONS } from '../../db/collections.js';

export const visitsIndexes = {
  [COLLECTIONS.visits]: [{ key: { userId: 1, visitDate: -1 } }, { key: { restaurantId: 1 } }],
};

const visits = () => getDb().collection(COLLECTIONS.visits);
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Joins each visit to its restaurant and to the latest inspection on or before that day.
const withKitchenThatDay = [
  {
    $lookup: {
      from: COLLECTIONS.restaurants,
      localField: 'restaurantId',
      foreignField: '_id',
      as: 'restaurant',
      pipeline: [{ $project: { name: 1, neighborhood: 1 } }],
    },
  },
  {
    $lookup: {
      from: COLLECTIONS.inspections,
      let: { rid: '$restaurantId', until: { $add: ['$visitDate', ONE_DAY_MS] } },
      pipeline: [
        {
          $match: {
            $expr: { $and: [{ $eq: ['$restaurantId', '$$rid'] }, { $lt: ['$date', '$$until'] }] },
          },
        },
        { $sort: { date: -1 } },
        { $limit: 1 },
        { $project: { _id: 0, date: 1, result: 1, severityScore: 1 } },
      ],
      as: 'inspectionAtVisit',
    },
  },
  {
    $set: {
      restaurant: { $first: '$restaurant' },
      inspectionAtVisit: { $ifNull: [{ $first: '$inspectionAtVisit' }, null] },
    },
  },
  { $match: { restaurant: { $ne: null } } },
  { $project: { userId: 0, restaurantId: 0 } },
];

export function listForUser(userId) {
  return visits()
    .aggregate([
      { $match: { userId } },
      { $sort: { visitDate: -1, createdAt: -1 } },
      ...withKitchenThatDay,
    ])
    .toArray();
}

export async function findForUser(id, userId) {
  const [visit] = await visits()
    .aggregate([{ $match: { _id: id, userId } }, ...withKitchenThatDay])
    .toArray();
  return visit ?? null;
}

// Severity bands, matching the frontend's severity.js: under 20 is clean, 50+ is serious.
const CLEAN_BELOW = 20;
const SERIOUS_FROM = 50;
const LOVED_FROM = 4;
const scoreThatDay = { $ifNull: ['$inspectionAtVisit.severityScore', null] };
const pickOne = (match, sort) => [
  { $match: match },
  { $sort: sort },
  { $limit: 1 },
  { $project: { _id: 0, name: '$restaurant.name', rating: 1, score: scoreThatDay } },
];

// "Your year in kitchens": one aggregation over the user's visits in that calendar year.
export async function recapForUser(userId, year) {
  const [facets] = await visits()
    .aggregate([
      {
        $match: {
          userId,
          visitDate: {
            $gte: new Date(Date.UTC(year, 0, 1)),
            $lt: new Date(Date.UTC(year + 1, 0, 1)),
          },
        },
      },
      ...withKitchenThatDay,
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                meals: { $sum: 1 },
                neighborhoods: { $addToSet: '$restaurant.neighborhood' },
                clean: {
                  $sum: {
                    $cond: [{ $lt: [{ $ifNull: [scoreThatDay, CLEAN_BELOW] }, CLEAN_BELOW] }, 1, 0],
                  },
                },
              },
            },
          ],
          topNeighborhood: [
            { $match: { 'restaurant.neighborhood': { $nin: [null, ''] } } },
            { $group: { _id: '$restaurant.neighborhood', n: { $sum: 1 } } },
            { $sort: { n: -1, _id: 1 } },
            { $limit: 1 },
          ],
          safeFavorite: pickOne(
            {
              rating: { $gte: LOVED_FROM },
              'inspectionAtVisit.severityScore': { $lt: CLEAN_BELOW },
            },
            { rating: -1, 'inspectionAtVisit.severityScore': 1, visitDate: -1 },
          ),
          guiltyPleasure: pickOne(
            {
              rating: { $gte: LOVED_FROM },
              'inspectionAtVisit.severityScore': { $gte: SERIOUS_FROM },
            },
            { rating: -1, 'inspectionAtVisit.severityScore': -1, visitDate: -1 },
          ),
        },
      },
    ])
    .toArray();

  const totals = facets.totals[0];
  if (!totals) return { year, meals: 0 };
  return {
    year,
    meals: totals.meals,
    neighborhoods: totals.neighborhoods.filter(Boolean).length,
    cleanShare: Math.round((totals.clean / totals.meals) * 100),
    topNeighborhood: facets.topNeighborhood[0]?._id ?? null,
    safeFavorite: facets.safeFavorite[0] ?? null,
    guiltyPleasure: facets.guiltyPleasure[0] ?? null,
  };
}

export async function create(userId, fields) {
  const now = new Date();
  const { insertedId } = await visits().insertOne({
    ...fields,
    userId,
    createdAt: now,
    updatedAt: now,
  });
  return insertedId;
}

export async function update(id, userId, fields) {
  const { matchedCount } = await visits().updateOne(
    { _id: id, userId },
    { $set: { ...fields, updatedAt: new Date() } },
  );
  return matchedCount > 0;
}

export async function remove(id, userId) {
  const { deletedCount } = await visits().deleteOne({ _id: id, userId });
  return deletedCount > 0;
}

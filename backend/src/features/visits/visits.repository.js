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

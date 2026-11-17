import { getDb } from '../../db/connection.js';
import { COLLECTIONS } from '../../db/collections.js';

export const spotsIndexes = {
  [COLLECTIONS.spots]: [{ key: { userId: 1, updatedAt: -1 } }],
};

// Every query is scoped to the owner, so one user can never read or change another's lists.
const spots = () => getDb().collection(COLLECTIONS.spots);

export function listForUser(userId) {
  return spots().find({ userId }).sort({ updatedAt: -1 }).toArray();
}

export function findForUser(id, userId) {
  return spots().findOne({ _id: id, userId });
}

export async function create(userId, fields) {
  const now = new Date();
  const { insertedId } = await spots().insertOne({
    ...fields,
    userId,
    createdAt: now,
    updatedAt: now,
  });
  return insertedId;
}

export async function update(id, userId, fields) {
  const { matchedCount } = await spots().updateOne(
    { _id: id, userId },
    { $set: { ...fields, updatedAt: new Date() } },
  );
  return matchedCount > 0;
}

export async function remove(id, userId) {
  const { deletedCount } = await spots().deleteOne({ _id: id, userId });
  return deletedCount > 0;
}

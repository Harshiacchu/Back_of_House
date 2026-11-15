import { getDb } from '../../db/connection.js';
import { COLLECTIONS } from '../../db/collections.js';

export const pollsIndexes = {
  [COLLECTIONS.polls]: [{ key: { creatorId: 1, updatedAt: -1 } }, { key: { 'votes.userId': 1 } }],
};

const polls = () => getDb().collection(COLLECTIONS.polls);

// Polls the user created or voted in, newest activity first, with candidate names for the cards.
export function listForUser(userId) {
  return polls()
    .aggregate([
      { $match: { $or: [{ creatorId: userId }, { 'votes.userId': userId }] } },
      { $sort: { updatedAt: -1 } },
      {
        $lookup: {
          from: COLLECTIONS.restaurants,
          localField: 'restaurantIds',
          foreignField: '_id',
          as: 'restaurants',
          pipeline: [{ $project: { name: 1 } }],
        },
      },
    ])
    .toArray();
}

export function findById(id) {
  return polls().findOne({ _id: id });
}

export async function create(creator, fields) {
  const now = new Date();
  const { insertedId } = await polls().insertOne({
    ...fields,
    creatorId: creator.id,
    creatorName: creator.displayName,
    votes: [],
    createdAt: now,
    updatedAt: now,
  });
  return insertedId;
}

// Only the creator matches. Votes for restaurants taken off the poll are dropped.
export async function update(id, creatorId, fields) {
  const { matchedCount } = await polls().updateOne(
    { _id: id, creatorId },
    {
      $set: { ...fields, updatedAt: new Date() },
      $pull: { votes: { restaurantId: { $nin: fields.restaurantIds } } },
    },
  );
  return matchedCount > 0;
}

export async function remove(id, creatorId) {
  const { deletedCount } = await polls().deleteOne({ _id: id, creatorId });
  return deletedCount > 0;
}

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

// One vote per user: change it if they already voted, otherwise add it. The $ne filter on the
// push keeps two quick clicks from ever adding a second vote.
export async function castVote(id, voter, restaurantId) {
  const now = new Date();
  const changed = await polls().updateOne(
    { _id: id, 'votes.userId': voter.id },
    {
      $set: { 'votes.$.restaurantId': restaurantId, 'votes.$.votedAt': now, updatedAt: now },
    },
  );
  if (changed.matchedCount > 0) return;
  await polls().updateOne(
    { _id: id, 'votes.userId': { $ne: voter.id } },
    {
      $push: {
        votes: { userId: voter.id, voterName: voter.displayName, restaurantId, votedAt: now },
      },
      $set: { updatedAt: now },
    },
  );
}

export async function remove(id, creatorId) {
  const { deletedCount } = await polls().deleteOne({ _id: id, creatorId });
  return deletedCount > 0;
}

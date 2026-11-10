import { getDb } from '../../db/connection.js';
import { COLLECTIONS } from '../../db/collections.js';

export const pollsIndexes = {
  [COLLECTIONS.polls]: [{ key: { creatorId: 1, updatedAt: -1 } }, { key: { 'votes.userId': 1 } }],
};

export const polls = () => getDb().collection(COLLECTIONS.polls);

import { getDb } from '../../db/connection.js';
import { COLLECTIONS } from '../../db/collections.js';

export const spotsIndexes = {
  [COLLECTIONS.spots]: [{ key: { userId: 1, updatedAt: -1 } }],
};

export const spots = () => getDb().collection(COLLECTIONS.spots);

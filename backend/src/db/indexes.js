import { getDb } from './connection.js';
import { usersIndexes } from '../features/auth/users.repository.js';
import { restaurantsIndexes } from '../features/restaurants/restaurants.repository.js';
import { visitsIndexes } from '../features/visits/visits.repository.js';
import { pollsIndexes } from '../features/polls/polls.repository.js';
import { spotsIndexes } from '../features/spots/spots.repository.js';

// Each feature declares its own indexes next to its repository; this file only collects them.
const ALL = [usersIndexes, restaurantsIndexes, visitsIndexes, pollsIndexes, spotsIndexes];

export async function ensureIndexes() {
  const db = getDb();
  await Promise.all(
    ALL.flatMap((byCollection) =>
      Object.entries(byCollection).map(([name, specs]) => db.collection(name).createIndexes(specs)),
    ),
  );
}

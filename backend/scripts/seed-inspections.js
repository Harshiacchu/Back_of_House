// Seeds `restaurants` and `inspections` from the City of Boston Food Establishment
// Inspections dataset (Analyze Boston, public domain).
//
//   npm run seed                  fetch (or reuse cached) data and load it
//   npm run seed -- --refresh     ignore the cache and download fresh data
//
// Safe to re-run: restaurants are upserted by license number, so their _id never changes
// and visits, polls and spots that point at them keep working.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { DATASET_URL, fetchRows } from './lib/bostonData.js';
import { buildRecords } from './lib/transform.js';
import { COLLECTIONS } from '../src/db/collections.js';
import { closeDb, connectDb } from '../src/db/connection.js';
import { ensureIndexes } from '../src/db/indexes.js';

const SINCE = '2023-01-01';
const CACHE = path.join(import.meta.dirname, 'data', `inspections-since-${SINCE}.json`);
const BATCH = 1000;

async function loadRows(refresh) {
  if (!refresh) {
    try {
      const rows = JSON.parse(await readFile(CACHE, 'utf8'));
      console.log(
        `Using cached data (${rows.length.toLocaleString()} rows). --refresh to re-download.`,
      );
      return rows;
    } catch {
      // no cache yet
    }
  }
  console.log(`Downloading inspections since ${SINCE} from ${DATASET_URL}`);
  const rows = await fetchRows({
    since: SINCE,
    onPage: (n) => process.stdout.write(`\r  ${n.toLocaleString()} rows`),
  });
  process.stdout.write('\n');
  await mkdir(path.dirname(CACHE), { recursive: true });
  await writeFile(CACHE, JSON.stringify(rows));
  return rows;
}

async function save(db, records) {
  const restaurants = db.collection(COLLECTIONS.restaurants);
  const inspections = db.collection(COLLECTIONS.inspections);
  const now = new Date();

  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    await restaurants.bulkWrite(
      batch.map(({ restaurant }) => ({
        updateOne: {
          filter: { licenseNo: restaurant.licenseNo },
          update: { $set: { ...restaurant, updatedAt: now }, $setOnInsert: { createdAt: now } },
          upsert: true,
        },
      })),
      { ordered: false },
    );
    process.stdout.write(`\r  restaurants ${Math.min(i + BATCH, records.length).toLocaleString()}`);
  }
  process.stdout.write('\n');

  const ids = new Map(
    (await restaurants.find({}, { projection: { licenseNo: 1 } }).toArray()).map((r) => [
      r.licenseNo,
      r._id,
    ]),
  );

  const docs = records.flatMap(({ restaurant, inspections: list }) =>
    list.map((inspection) => ({
      ...inspection,
      restaurantId: ids.get(restaurant.licenseNo),
      licenseNo: restaurant.licenseNo,
    })),
  );
  await inspections.deleteMany({ restaurantId: { $in: [...ids.values()] } });
  for (let i = 0; i < docs.length; i += BATCH * 5) {
    await inspections.insertMany(docs.slice(i, i + BATCH * 5), { ordered: false });
    process.stdout.write(
      `\r  inspections ${Math.min(i + BATCH * 5, docs.length).toLocaleString()}`,
    );
  }
  process.stdout.write('\n');
  return docs.length;
}

async function main() {
  const rows = await loadRows(process.argv.includes('--refresh'));
  const records = buildRecords(rows);
  console.log(`Built ${records.length.toLocaleString()} restaurants.`);

  const db = await connectDb();
  await ensureIndexes();
  const inspectionCount = await save(db, records);

  const byTrend = await db
    .collection(COLLECTIONS.restaurants)
    .aggregate([{ $group: { _id: '$summary.trajectory', n: { $sum: 1 } } }, { $sort: { n: -1 } }])
    .toArray();
  console.log(
    `Done: ${records.length.toLocaleString()} restaurants, ${inspectionCount.toLocaleString()} inspections.`,
  );
  console.log(
    'Trajectories:',
    byTrend.map((t) => `${t._id ?? 'not enough history'} ${t.n}`).join(' · '),
  );
}

try {
  await main();
} catch (err) {
  console.error('\nSeed failed:', err);
  process.exitCode = 1;
} finally {
  await closeDb();
}

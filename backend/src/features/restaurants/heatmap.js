import { inspections, restaurants } from './restaurants.repository.js';

// Data for the Kitchen Weather map: every restaurant's position, plus, for each quarter, the
// worst inspection score of every kitchen inspected that quarter (cells = [point, score, ...]). Inspection data only
// changes when the seed runs, so it is built once per server process and kept in memory
// (about 150 KB).
const round = (n) => Math.round(n * 10000) / 10000;

async function build() {
  const rows = await restaurants()
    .find(
      { 'location.coordinates': { $exists: true } },
      { projection: { location: 1, neighborhood: 1 } },
    )
    .toArray();

  const hoods = [...new Set(rows.map((r) => r.neighborhood || 'Boston'))].sort();
  const hoodIndex = new Map(hoods.map((name, i) => [name, i]));
  const pointIndex = new Map(rows.map((r, i) => [String(r._id), i]));
  const points = rows.map((r) => {
    const [lng, lat] = r.location.coordinates;
    return [round(lng), round(lat), hoodIndex.get(r.neighborhood || 'Boston')];
  });

  const perKitchenQuarter = await inspections()
    .aggregate([
      {
        $group: {
          _id: {
            restaurant: '$restaurantId',
            year: { $year: '$date' },
            quarter: { $ceil: { $divide: [{ $month: '$date' }, 3] } },
          },
          score: { $max: '$severityScore' },
        },
      },
    ])
    .toArray();

  const quarters = new Map();
  for (const { _id, score } of perKitchenQuarter) {
    const point = pointIndex.get(String(_id.restaurant));
    if (point === undefined) continue;
    const key = _id.year * 10 + _id.quarter;
    if (!quarters.has(key)) {
      quarters.set(key, { label: `${_id.year} Q${_id.quarter}`, cells: [] });
    }
    quarters.get(key).cells.push(point, score);
  }

  return {
    hoods,
    points,
    quarters: [...quarters.entries()].sort(([a], [b]) => a - b).map(([, q]) => q),
  };
}

let once;
export function getHeatmap() {
  once ??= build().catch((err) => {
    once = undefined;
    throw err;
  });
  return once;
}

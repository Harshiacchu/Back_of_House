import { Router } from 'express';

import { getHeatmap } from './heatmap.js';
import { findReport, listNeighborhoods, search, suggest } from './restaurants.repository.js';
import { TRAJECTORIES } from './scoring/trajectory.js';
import { SORTS } from './search.js';
import { notFound } from '../../lib/errors.js';
import { toObjectId } from '../../lib/validation.js';

const router = Router();
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;
const SUGGESTIONS = 6;

const asText = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const asPositiveInt = (value, fallback, max = Infinity) => {
  const n = Number.parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? Math.min(n, max) : fallback;
};

// Inspection data only changes when the seed runs, so browsers may reuse responses for a while.
const cacheFor = (res, seconds) => res.set('Cache-Control', `public, max-age=${seconds}`);

// GET /api/restaurants?q=&neighborhood=&trajectory=&sort=&cursor=&limit=
router.get('/', async (req, res) => {
  const trajectory = asText(req.query.trajectory, 20);
  const sort = asText(req.query.sort, 20);
  cacheFor(res, 60);
  res.json(
    await search({
      q: asText(req.query.q, 80),
      neighborhood: asText(req.query.neighborhood, 60),
      trajectory: TRAJECTORIES.includes(trajectory) ? trajectory : '',
      sort: sort in SORTS ? sort : 'recent',
      cursor: asText(req.query.cursor, 200),
      limit: asPositiveInt(req.query.limit, DEFAULT_LIMIT, MAX_LIMIT),
    }),
  );
});

// GET /api/restaurants/suggest?q=  (autocomplete)
router.get('/suggest', async (req, res) => {
  cacheFor(res, 300);
  res.json({ suggestions: await suggest(asText(req.query.q, 80), SUGGESTIONS) });
});

// GET /api/restaurants/heatmap  (Kitchen Weather map data, built once per process)
router.get('/heatmap', async (_req, res) => {
  cacheFor(res, 3600);
  res.json(await getHeatmap());
});

// GET /api/restaurants/neighborhoods
router.get('/neighborhoods', async (_req, res) => {
  cacheFor(res, 3600);
  res.json({ neighborhoods: await listNeighborhoods() });
});

// GET /api/restaurants/:id  (kitchen report)
router.get('/:id', async (req, res) => {
  const report = await findReport(toObjectId(req.params.id, 'Restaurant'));
  if (!report) throw notFound('Restaurant');
  cacheFor(res, 300);
  res.json(report);
});

export default router;

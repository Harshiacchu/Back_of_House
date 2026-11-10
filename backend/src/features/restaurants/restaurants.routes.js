import { Router } from 'express';

import { findReport, listNeighborhoods, search } from './restaurants.repository.js';
import { TRAJECTORIES } from './scoring/trajectory.js';
import { notFound } from '../../lib/errors.js';
import { toObjectId } from '../../lib/validation.js';

const router = Router();
const MAX_LIMIT = 50;

const asText = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const asPositiveInt = (value, fallback, max = Infinity) => {
  const n = Number.parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? Math.min(n, max) : fallback;
};

// GET /api/restaurants?q=&neighborhood=&trajectory=&page=&limit=
router.get('/', async (req, res) => {
  const trajectory = asText(req.query.trajectory, 20);
  res.json(
    await search({
      q: asText(req.query.q, 80),
      neighborhood: asText(req.query.neighborhood, 60),
      trajectory: TRAJECTORIES.includes(trajectory) ? trajectory : '',
      page: asPositiveInt(req.query.page, 1),
      limit: asPositiveInt(req.query.limit, 12, MAX_LIMIT),
    }),
  );
});

// GET /api/restaurants/neighborhoods
router.get('/neighborhoods', async (_req, res) => {
  const neighborhoods = (await listNeighborhoods()).filter(Boolean).sort();
  res.json({ neighborhoods });
});

// GET /api/restaurants/:id  (kitchen report)
router.get('/:id', async (req, res) => {
  const report = await findReport(toObjectId(req.params.id, 'Restaurant'));
  if (!report) throw notFound('Restaurant');
  res.json(report);
});

export default router;

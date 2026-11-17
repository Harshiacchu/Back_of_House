import { ObjectId } from 'mongodb';
import { Router } from 'express';

import {
  create,
  findForUser,
  listForUser,
  recapForUser,
  remove,
  update,
} from './visits.repository.js';
import { parseVisitInput } from './visits.validation.js';
import { notFound } from '../../lib/errors.js';
import { toObjectId } from '../../lib/validation.js';
import { exists as restaurantExists } from '../restaurants/restaurants.repository.js';

// Every route runs behind requireAuth; every query is scoped to the signed-in user.
const router = Router();
const userIdOf = (req) => new ObjectId(req.user.id);

async function parseWithRestaurant(body) {
  const input = parseVisitInput(body);
  const restaurantId = new ObjectId(input.restaurantId);
  if (!(await restaurantExists(restaurantId))) throw notFound('Restaurant');
  return { ...input, restaurantId };
}

router.get('/', async (req, res) => {
  res.json({ items: await listForUser(userIdOf(req)) });
});

// GET /api/visits/recap?year=2026 -> { year, meals, neighborhoods, cleanShare, ... }
router.get('/recap', async (req, res) => {
  const thisYear = new Date().getUTCFullYear();
  const year = Number.parseInt(req.query.year, 10);
  const valid = Number.isInteger(year) && year >= 2000 && year <= thisYear;
  res.json({ recap: await recapForUser(userIdOf(req), valid ? year : thisYear) });
});

router.post('/', async (req, res) => {
  const fields = await parseWithRestaurant(req.body);
  const id = await create(userIdOf(req), fields);
  res.status(201).json({ visit: await findForUser(id, userIdOf(req)) });
});

router.get('/:id', async (req, res) => {
  const visit = await findForUser(toObjectId(req.params.id, 'Visit'), userIdOf(req));
  if (!visit) throw notFound('Visit');
  res.json({ visit });
});

router.put('/:id', async (req, res) => {
  const id = toObjectId(req.params.id, 'Visit');
  const fields = await parseWithRestaurant(req.body);
  if (!(await update(id, userIdOf(req), fields))) throw notFound('Visit');
  res.json({ visit: await findForUser(id, userIdOf(req)) });
});

router.delete('/:id', async (req, res) => {
  if (!(await remove(toObjectId(req.params.id, 'Visit'), userIdOf(req)))) throw notFound('Visit');
  res.status(204).end();
});

export default router;

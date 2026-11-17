import { ObjectId } from 'mongodb';
import { Router } from 'express';

import { create, findForUser, listForUser, remove, update } from './spots.repository.js';
import { parseSpotListInput } from './spots.validation.js';
import { notFound } from '../../lib/errors.js';
import { toObjectId } from '../../lib/validation.js';
import { findSummariesByIds } from '../restaurants/restaurants.repository.js';

// Every route runs behind requireAuth; every query is scoped to the signed-in user.
const router = Router();
const userIdOf = (req) => new ObjectId(req.user.id);

// Attaches each item's restaurant summary (one query for all lists) and drops ownership fields.
async function withRestaurants(lists) {
  const ids = lists.flatMap((list) => list.items.map((item) => item.restaurantId));
  const summaries = await findSummariesByIds(ids);
  const byId = new Map(summaries.map((r) => [String(r._id), r]));
  return lists.map(({ userId: _owner, ...list }) => ({
    ...list,
    items: list.items
      .filter((item) => byId.has(String(item.restaurantId)))
      .map(({ restaurantId, ...item }) => ({
        ...item,
        restaurant: byId.get(String(restaurantId)),
      })),
  }));
}

// Validates the body, checks every restaurant exists, and keeps the original addedAt for
// restaurants that were already on the list.
async function parseItems(body, previous = []) {
  const input = parseSpotListInput(body);
  const ids = input.items.map((item) => new ObjectId(item.restaurantId));
  const found = await findSummariesByIds(ids);
  if (found.length !== ids.length) throw notFound('Restaurant');

  const addedAt = new Map(previous.map((item) => [String(item.restaurantId), item.addedAt]));
  const now = new Date();
  return {
    ...input,
    items: input.items.map((item, i) => ({
      restaurantId: ids[i],
      note: item.note,
      addedAt: addedAt.get(item.restaurantId) ?? now,
    })),
  };
}

async function findOrThrow(req) {
  const list = await findForUser(toObjectId(req.params.id, 'List'), userIdOf(req));
  if (!list) throw notFound('List');
  return list;
}

router.get('/', async (req, res) => {
  res.json({ items: await withRestaurants(await listForUser(userIdOf(req))) });
});

router.post('/', async (req, res) => {
  const id = await create(userIdOf(req), await parseItems(req.body));
  const [list] = await withRestaurants([await findForUser(id, userIdOf(req))]);
  res.status(201).json({ list });
});

router.get('/:id', async (req, res) => {
  const [list] = await withRestaurants([await findOrThrow(req)]);
  res.json({ list });
});

router.put('/:id', async (req, res) => {
  const existing = await findOrThrow(req);
  const fields = await parseItems(req.body, existing.items);
  if (!(await update(existing._id, userIdOf(req), fields))) throw notFound('List');
  const [list] = await withRestaurants([await findForUser(existing._id, userIdOf(req))]);
  res.json({ list });
});

router.delete('/:id', async (req, res) => {
  if (!(await remove(toObjectId(req.params.id, 'List'), userIdOf(req)))) throw notFound('List');
  res.status(204).end();
});

export default router;

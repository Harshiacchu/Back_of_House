import { ObjectId } from 'mongodb';
import { Router } from 'express';

import { create, findById, listForUser, remove, update } from './polls.repository.js';
import { parsePollInput } from './polls.validation.js';
import { forbidden, notFound } from '../../lib/errors.js';
import { toObjectId } from '../../lib/validation.js';
import { findSummariesByIds } from '../restaurants/restaurants.repository.js';

// Every route runs behind requireAuth. Any signed-in user with the link can open a poll;
// only its creator may edit or delete it.
const router = Router();
const userIdOf = (req) => new ObjectId(req.user.id);

// Voter ids never leave the server; the client only learns counts and its own vote.
function toPublicPoll(poll, userId) {
  return {
    _id: poll._id,
    title: poll.title,
    creatorName: poll.creatorName,
    isCreator: poll.creatorId.equals(userId),
    restaurantIds: poll.restaurantIds,
    totalVotes: poll.votes.length,
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
  };
}

async function parseWithRestaurants(body) {
  const input = parsePollInput(body);
  const restaurantIds = input.restaurantIds.map((id) => new ObjectId(id));
  const found = await findSummariesByIds(restaurantIds);
  if (found.length !== restaurantIds.length) throw notFound('Restaurant');
  return { ...input, restaurantIds };
}

async function findOrThrow(req) {
  const poll = await findById(toObjectId(req.params.id, 'Poll'));
  if (!poll) throw notFound('Poll');
  return poll;
}

// 404 if the poll is gone, 403 if it belongs to someone else.
async function requireCreator(req) {
  const poll = await findOrThrow(req);
  if (!poll.creatorId.equals(userIdOf(req))) throw forbidden('Only the poll’s creator can do that');
  return poll;
}

router.get('/', async (req, res) => {
  const userId = userIdOf(req);
  const items = await listForUser(userId);
  res.json({
    items: items.map((poll) => ({
      ...toPublicPoll(poll, userId),
      restaurantNames: poll.restaurants.map((r) => r.name),
    })),
  });
});

router.post('/', async (req, res) => {
  const fields = await parseWithRestaurants(req.body);
  const id = await create({ id: userIdOf(req), displayName: req.user.displayName }, fields);
  res.status(201).json({ poll: toPublicPoll(await findById(id), userIdOf(req)) });
});

router.get('/:id', async (req, res) => {
  res.json({ poll: toPublicPoll(await findOrThrow(req), userIdOf(req)) });
});

router.put('/:id', async (req, res) => {
  const poll = await requireCreator(req);
  const fields = await parseWithRestaurants(req.body);
  if (!(await update(poll._id, userIdOf(req), fields))) throw notFound('Poll');
  res.json({ poll: toPublicPoll(await findById(poll._id), userIdOf(req)) });
});

router.delete('/:id', async (req, res) => {
  const poll = await requireCreator(req);
  if (!(await remove(poll._id, userIdOf(req)))) throw notFound('Poll');
  res.status(204).end();
});

export default router;

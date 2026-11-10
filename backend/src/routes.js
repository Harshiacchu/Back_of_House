import { Router } from 'express';

import authRouter from './features/auth/auth.routes.js';
import restaurantsRouter from './features/restaurants/restaurants.routes.js';
import visitsRouter from './features/visits/visits.routes.js';
import pollsRouter from './features/polls/polls.routes.js';
import spotsRouter from './features/spots/spots.routes.js';
import { requireAuth } from './middleware/requireAuth.js';

// Mounts every feature under /api. Public routes first, then private ones.
const api = Router();

api.get('/health', (_req, res) => res.json({ ok: true }));

// Public
api.use('/auth', authRouter);
api.use('/restaurants', restaurantsRouter);

// Private (logged-in users only)
api.use('/visits', requireAuth, visitsRouter);
api.use('/polls', requireAuth, pollsRouter);
api.use('/spots', requireAuth, spotsRouter);

export default api;

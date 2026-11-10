import express from 'express';
import path from 'node:path';

import { env } from './config/env.js';
import passport from './config/passport.js';
import { createSessionMiddleware } from './config/session.js';
import { apiNotFound, errorHandler } from './middleware/errorHandler.js';
import api from './routes.js';

const FRONTEND_DIST = path.resolve(import.meta.dirname, '../../frontend/dist');

// Builds the Express app. Call after the database is connected (sessions use it).
export function createApp() {
  const app = express();

  if (env.isProduction) app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(express.json({ limit: '100kb' }));
  app.use(createSessionMiddleware());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api', api);
  app.use('/api', apiNotFound);

  // Serve the React build; any non-API route falls back to index.html (client-side routing).
  app.use(express.static(FRONTEND_DIST));
  app.get('/{*splat}', (_req, res) => res.sendFile(path.join(FRONTEND_DIST, 'index.html')));

  app.use(errorHandler);
  return app;
}

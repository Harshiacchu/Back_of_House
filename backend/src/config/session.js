import MongoStore from 'connect-mongo';
import session from 'express-session';

import { env } from './env.js';
import { getClient } from '../db/connection.js';
import { COLLECTIONS } from '../db/collections.js';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Sessions live in MongoDB so logins survive restarts and redeploys.
export function createSessionMiddleware() {
  return session({
    name: 'boh.sid',
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: getClient(),
      dbName: env.dbName,
      collectionName: COLLECTIONS.sessions,
      ttl: ONE_WEEK_MS / 1000,
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.isProduction,
      maxAge: ONE_WEEK_MS,
    },
  });
}

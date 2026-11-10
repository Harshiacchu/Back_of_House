import { unauthorized } from '../lib/errors.js';

// Guards private routes. Passport sets req.user from the session.
export function requireAuth(req, _res, next) {
  if (!req.isAuthenticated()) return next(unauthorized());
  return next();
}

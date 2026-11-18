import bcrypt from 'bcryptjs';
import { Router } from 'express';

import { parseEmailOnly, parseRegister, parseVerify } from './auth.validation.js';
import { createUser, findByEmail, toPublicUser, updateUser } from './users.repository.js';
import { checkVerificationCode, sendVerificationCode } from './verification.js';
import { isMailEnabled } from '../../config/env.js';
import passport from '../../config/passport.js';
import { HttpError, conflict, unauthorized } from '../../lib/errors.js';

const router = Router();
const SALT_ROUNDS = 12;

// Promisified req.login (passport regenerates the session to prevent fixation).
const logIn = (req, user) =>
  new Promise((resolve, reject) => {
    req.login(user, (err) => (err ? reject(err) : resolve()));
  });

// Sends a code, unless one went out in the last minute (that one is still valid).
async function sendCodeUnlessRecent(user) {
  try {
    await sendVerificationCode(user);
  } catch (err) {
    if (err.status !== 429) throw err;
  }
}

// Which sign-in options this server supports, so the UI can adapt.
router.get('/providers', (_req, res) => {
  res.json({ emailDelivery: isMailEnabled ? 'email' : 'console' });
});

// Create (or re-create, if never verified) an email account and send a code. No login yet.
router.post('/register', async (req, res) => {
  const { email, displayName, password } = parseRegister(req.body);
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const existing = await findByEmail(email);

  let user;
  if (existing?.emailVerified) {
    throw conflict('An account with this email already exists. Sign in instead.');
  } else if (existing) {
    user = await updateUser(existing._id, { displayName, passwordHash });
  } else {
    user = await createUser({ email, displayName, passwordHash });
  }

  await sendCodeUnlessRecent(user);
  res.status(202).json({ email: user.email, verificationRequired: true });
});

router.post('/verify', async (req, res) => {
  const { email, code } = parseVerify(req.body);
  const user = await findByEmail(email);
  // A verified account never signs in through this route: it needs its password.
  if (!user || user.emailVerified) throw new HttpError(400, 'That code isn’t right.');
  await checkVerificationCode(user, code);
  await updateUser(user._id, { emailVerified: true, verification: null });
  const publicUser = toPublicUser(user);
  await logIn(req, publicUser);
  res.json({ user: publicUser });
});

// Always answers the same way, so it can't be used to discover which emails have accounts.
router.post('/resend', async (req, res) => {
  const { email } = parseEmailOnly(req.body);
  const user = await findByEmail(email);
  if (user && !user.emailVerified) await sendVerificationCode(user);
  res.json({ ok: true });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    try {
      if (err) throw err;
      if (info?.unverified) {
        await sendCodeUnlessRecent(info.unverified);
        return res.status(403).json({
          error: 'Verify your email to finish signing in. We sent you a code.',
          verificationRequired: true,
          email: info.unverified.email,
        });
      }
      if (!user) throw unauthorized(info?.message);
      await logIn(req, user);
      return res.json({ user });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return req.session.destroy(() => {
      res.clearCookie('boh.sid');
      res.status(204).end();
    });
  });
});

// Returns { user: null } when logged out (not a 401) so the app can boot quietly.
router.get('/me', (req, res) => {
  res.json({ user: req.user ?? null });
});

export default router;

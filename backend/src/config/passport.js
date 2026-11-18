import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { findByEmail, findById, toPublicUser } from '../features/auth/users.repository.js';

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await findByEmail(email);
      const ok = user?.passwordHash && (await bcrypt.compare(password, user.passwordHash));
      if (!ok) return done(null, false, { message: 'Incorrect email or password' });
      if (!user.emailVerified) {
        return done(null, false, { message: 'Verify your email first', unverified: user });
      }
      return done(null, toPublicUser(user));
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    done(null, user ? toPublicUser(user) : false);
  } catch (err) {
    done(err);
  }
});

export default passport;

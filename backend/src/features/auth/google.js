import { randomBytes } from 'node:crypto';

import { createUser, findByEmail, findByGoogleId, updateUser } from './users.repository.js';
import { env } from '../../config/env.js';
import { HttpError } from '../../lib/errors.js';

// Google OAuth 2.0 authorization-code flow, implemented with fetch (no extra library).
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';

export const redirectUri = () => `${env.appUrl}/api/auth/google/callback`;

export function newState() {
  return randomBytes(24).toString('hex');
}

export function authorizationUrl(state) {
  const params = new URLSearchParams({
    client_id: env.google.clientId,
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });
  return `${AUTH_URL}?${params}`;
}

async function fetchProfile(code) {
  const tokenResponse = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.google.clientId,
      client_secret: env.google.clientSecret,
      redirect_uri: redirectUri(),
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenResponse.ok) throw new HttpError(502, 'Google sign-in failed');
  const { access_token: accessToken } = await tokenResponse.json();

  const profileResponse = await fetch(USERINFO_URL, {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!profileResponse.ok) throw new HttpError(502, 'Google sign-in failed');
  return profileResponse.json();
}

// Finds or creates the user for a Google account. Links to an existing email account.
export async function userFromGoogleCode(code) {
  const profile = await fetchProfile(code);
  if (!profile.email || !profile.email_verified) {
    throw new HttpError(403, 'Your Google account email isn’t verified');
  }

  const byGoogle = await findByGoogleId(profile.sub);
  if (byGoogle) return byGoogle;

  const byEmail = await findByEmail(profile.email);
  if (byEmail) {
    return updateUser(byEmail._id, {
      googleId: profile.sub,
      emailVerified: true,
      verification: null,
    });
  }

  return createUser({
    email: profile.email,
    displayName: profile.name || profile.email.split('@')[0],
    googleId: profile.sub,
    emailVerified: true,
  });
}

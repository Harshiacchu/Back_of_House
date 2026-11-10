import dotenv from 'dotenv';
import path from 'node:path';

// backend/.env, wherever the process is started from. On a host, real env vars win.
dotenv.config({ path: path.resolve(import.meta.dirname, '../../.env'), quiet: true });

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set. Copy backend/.env.example to backend/.env.`);
  return value;
}

const optional = (name) => process.env[name] || null;

export const env = Object.freeze({
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 3000,
  mongoUri: required('MONGODB_URI'),
  dbName: process.env.DB_NAME || 'back_of_house',
  sessionSecret: required('SESSION_SECRET'),
  // Public URL of the site (where the browser is). Used for the Google redirect URI.
  appUrl: (process.env.APP_URL || 'http://localhost:5173').replace(/\/$/, ''),
  google: {
    clientId: optional('GOOGLE_CLIENT_ID'),
    clientSecret: optional('GOOGLE_CLIENT_SECRET'),
  },
  mail: {
    brevoApiKey: optional('BREVO_API_KEY'),
    from: optional('MAIL_FROM'),
    fromName: process.env.MAIL_FROM_NAME || 'Back of House',
  },
});

export const isGoogleEnabled = Boolean(env.google.clientId && env.google.clientSecret);
export const isMailEnabled = Boolean(env.mail.brevoApiKey && env.mail.from);

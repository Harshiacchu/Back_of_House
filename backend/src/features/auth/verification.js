import { createHash, randomInt, timingSafeEqual } from 'node:crypto';

import { incrementVerificationAttempts, updateUser } from './users.repository.js';
import { sendMail } from '../../lib/mailer.js';
import { HttpError, badRequest } from '../../lib/errors.js';

const CODE_TTL_MS = 15 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
export const MAX_ATTEMPTS = 5;

const hashCode = (userId, code) => createHash('sha256').update(`${userId}:${code}`).digest();

function emailBody(name, code) {
  const text = `Hi ${name},\n\nYour Back of House verification code is ${code}.\nIt expires in 15 minutes.\n\nIf you didn't ask for this, you can ignore this email.`;
  const html = `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;color:#1d1d1f">
  <p style="font-size:15px;font-weight:600;margin:0 0 24px">Back of House</p>
  <h1 style="font-size:26px;margin:0 0 12px">Verify your email</h1>
  <p style="font-size:16px;color:#6e6e73;margin:0 0 24px">Hi ${name}, enter this code to finish creating your account.</p>
  <p style="font-size:38px;font-weight:700;letter-spacing:10px;margin:0 0 24px">${code}</p>
  <p style="font-size:13px;color:#86868b;margin:0">The code expires in 15 minutes. If you didn’t ask for it, ignore this email.</p>
</div>`;
  return { text, html };
}

// Creates a fresh 6-digit code, stores only its hash, and emails it.
export async function sendVerificationCode(user) {
  const sentAt = user.verification?.sentAt;
  if (sentAt && Date.now() - sentAt.getTime() < RESEND_COOLDOWN_MS) {
    throw new HttpError(429, 'We just sent a code. Wait a minute before asking for another.');
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  await updateUser(user._id, {
    verification: {
      codeHash: hashCode(user._id, code).toString('hex'),
      expiresAt: new Date(Date.now() + CODE_TTL_MS),
      sentAt: new Date(),
      attempts: 0,
    },
  });
  await sendMail({
    to: user.email,
    subject: `${code} is your Back of House code`,
    ...emailBody(user.displayName, code),
  });
}

// Throws unless `code` matches the user's current, unexpired code.
export async function checkVerificationCode(user, code) {
  const v = user.verification;
  if (!v) throw badRequest('Ask for a new code first.');
  if (v.attempts >= MAX_ATTEMPTS) throw new HttpError(429, 'Too many tries. Ask for a new code.');
  if (v.expiresAt.getTime() < Date.now())
    throw badRequest('That code has expired. Ask for a new one.');

  const expected = Buffer.from(v.codeHash, 'hex');
  const actual = hashCode(user._id, code);
  if (!timingSafeEqual(expected, actual)) {
    await incrementVerificationAttempts(user._id);
    const left = MAX_ATTEMPTS - v.attempts - 1;
    throw badRequest(
      left > 0
        ? `That code isn’t right. ${left} tries left.`
        : 'Too many tries. Ask for a new code.',
    );
  }
}

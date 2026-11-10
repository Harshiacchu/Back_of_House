import { env, isMailEnabled } from '../config/env.js';
import { HttpError } from './errors.js';

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

// Sends one email through Brevo's HTTPS API (no extra library). In development without
// credentials, the message is printed to the server console instead.
export async function sendMail({ to, subject, text, html }) {
  if (!isMailEnabled) {
    if (env.isProduction) throw new HttpError(503, 'Email is not configured on this server');
    console.info(`\n[mail:dev] To: ${to}\n[mail:dev] Subject: ${subject}\n${text}\n`);
    return;
  }

  const response = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'api-key': env.mail.brevoApiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: env.mail.from, name: env.mail.fromName },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    console.error('Email send failed:', response.status, await response.text().catch(() => ''));
    throw new HttpError(502, 'We couldn’t send the email. Try again in a minute.');
  }
}

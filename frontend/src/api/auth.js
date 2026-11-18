import { request } from './client.js';

export const getMe = (signal) => request('/auth/me', { signal });
// -> { emailDelivery: 'email' | 'console' }
export const getProviders = (signal) => request('/auth/providers', { signal });
// -> 202 { email, verificationRequired: true }
export const register = (details) => request('/auth/register', { method: 'POST', body: details });
export const verifyEmail = (email, code) =>
  request('/auth/verify', { method: 'POST', body: { email, code } });
export const resendCode = (email) => request('/auth/resend', { method: 'POST', body: { email } });
// 403 with data.verificationRequired when the email isn't verified yet
export const login = (credentials) => request('/auth/login', { method: 'POST', body: credentials });
export const logout = () => request('/auth/logout', { method: 'POST' });

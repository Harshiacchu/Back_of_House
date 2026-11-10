import { getProviders } from '../api/auth.js';
import { useFetch } from './useFetch.js';

// { google, emailDelivery } from the server. Google shows in dev even when not configured,
// so the button can be tried; in production it only shows when the server supports it.
export function useAuthProviders() {
  const { data } = useFetch(getProviders);
  return {
    showGoogle: Boolean(data?.google) || import.meta.env.DEV,
    codesInConsole: data?.emailDelivery === 'console',
  };
}

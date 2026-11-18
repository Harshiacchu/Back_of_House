import { getProviders } from '../api/auth.js';
import { useFetch } from './useFetch.js';

// { emailDelivery } from the server: whether codes go out by email or print in the dev terminal.
export function useAuthProviders() {
  const { data } = useFetch(getProviders);
  return { codesInConsole: data?.emailDelivery === 'console' };
}

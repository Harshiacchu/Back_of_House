import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AuthContext } from './AuthContext.js';
import * as authApi from '../api/auth.js';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // An aborted check (StrictMode remount in dev) must not sign the user out or end loading,
    // or a direct link to a private page bounces to /login before the real check lands.
    const controller = new AbortController();
    authApi
      .getMe(controller.signal)
      .then((data) => setUser(data.user))
      .catch(() => {
        if (!controller.signal.aborted) setUser(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    setUser(data.user);
    return data.user;
  }, []);

  // Creates the account and sends a code; the user is signed in after verifyEmail().
  const register = useCallback((details) => authApi.register(details), []);

  const verifyEmail = useCallback(async (email, code) => {
    const data = await authApi.verifyEmail(email, code);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, verifyEmail, logout }),
    [user, loading, login, register, verifyEmail, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

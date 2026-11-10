import { createContext } from 'react';

// { user, loading, login, register, verifyEmail, logout }. Provided by AuthProvider; read with useAuth().
export const AuthContext = createContext(null);

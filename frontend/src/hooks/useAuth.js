import { createContext, useContext, useMemo, useState } from 'react';
import { clearSession, getStoredToken, getStoredUser, persistSession } from '../services/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      signIn: ({ nextToken, nextUser, nextTenant }) => {
        persistSession({ token: nextToken, user: nextUser, tenant: nextTenant });
        setToken(nextToken);
        setUser(nextUser);
      },
      signOut: () => {
        clearSession();
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}

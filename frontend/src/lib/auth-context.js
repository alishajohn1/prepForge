'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('prepforge_token');
    if (token) {
      getMe()
        .then(({ user }) => setUser(user))
        .catch(() => localStorage.removeItem('prepforge_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (user, token) => {
    localStorage.setItem('prepforge_token', token);
    setUser(user);
  };

  const logoutUser = () => {
    localStorage.removeItem('prepforge_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

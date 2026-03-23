import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem('silvUser') || 'null'));
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const persist = (data) => {
    setUser(data);
    if (data) localStorage.setItem('silvUser', JSON.stringify(data));
    else localStorage.removeItem('silvUser');
  };

  const register = useCallback(async (formData) => {
    setLoading(true); setError(null);
    try {
      const { data } = await authAPI.register(formData);
      persist(data);
      return data;
    } catch (e) {
      const msg = e.response?.data?.message || 'Registration failed';
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  }, []);

  const login = useCallback(async (formData) => {
    setLoading(true); setError(null);
    try {
      const { data } = await authAPI.login(formData);
      persist(data);
      return data;
    } catch (e) {
      const msg = e.response?.data?.message || 'Login failed';
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

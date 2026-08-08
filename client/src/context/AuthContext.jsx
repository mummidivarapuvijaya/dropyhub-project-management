import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dropyhub_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('dropyhub_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('dropyhub_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Failed to verify token', err);
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('dropyhub_token', res.data.token);
      localStorage.setItem('dropyhub_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  // Public registration: strictly name, email, password (no role sent!)
  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('dropyhub_token', res.data.token);
      localStorage.setItem('dropyhub_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  // Google OAuth 2.0 Login handler
  const googleLogin = async (googlePayload) => {
    const res = await API.post('/auth/google', googlePayload);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('dropyhub_token', res.data.token);
      localStorage.setItem('dropyhub_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('dropyhub_token');
    localStorage.removeItem('dropyhub_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

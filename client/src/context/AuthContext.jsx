import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = authService.getToken();
      if (token) {
        const freshUser = await authService.getMe();
        if (freshUser) {
          setUser(freshUser);
          return freshUser;
        }
      }
    } catch (err) {
      console.warn('Could not refresh user:', err.message);
    }
    return null;
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = authService.getToken();
        if (currentUser && token) {
          setUser(currentUser);
          // Refresh from server in background
          refreshUser();
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn('Error reading auth state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for 401 unauthorized broadcasts
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('shenova:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('shenova:unauthorized', handleUnauthorized);
    };
  }, [refreshUser]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    setIsLoading(true);
    try {
      const res = await authService.loginDemoUser();
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authService.signup(userData);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user && authService.getToken()),
        isLoading,
        login,
        loginDemo,
        signup,
        logout,
        setUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

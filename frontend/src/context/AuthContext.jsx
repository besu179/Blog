import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user
  const fetchCurrentUser = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      return user;
    } catch (error) {
      setCurrentUser(null);
      return null;
    }
  }, []);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchCurrentUser();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [fetchCurrentUser]);

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const user = await authService.login(email, password);
      // Refresh the current user to ensure we have the latest data
      const currentUser = await fetchCurrentUser();
      return { success: true, user: currentUser };
    } catch (error) {
      setCurrentUser(null);
      return { 
        success: false, 
        error: typeof error === 'string' ? error : 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      await authService.register(userData);
      // After registration, log the user in
      const { email, password } = userData;
      return await login(email, password);
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { 
        success: false, 
        error: 'Failed to log out. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    register,
    logout,
    refreshUser: fetchCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
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

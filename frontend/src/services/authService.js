import api from './api';

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/users', { user: userData });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { user: { email, password } });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Login failed. Please check your credentials.';
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.delete('/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Get current user profile - Using session from Rails
  getCurrentUser: async () => {
    try {
      // This will return the current user if logged in, or 401 if not
      const response = await api.get('/users/current');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return null; // No user logged in
      }
      console.error('Get current user error:', error);
      throw error;
    }
  }
};

export default authService;

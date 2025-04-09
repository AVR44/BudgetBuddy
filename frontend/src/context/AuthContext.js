import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Login function
  const login = async (formData) => {
    try {
      setLoading(true);
      const response = await authService.login(formData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        setIsAuthenticated(true);
        
        // Get user data
        const userData = await authService.getUser();
        setUser(userData);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (formData) => {
    try {
      setLoading(true);
      const response = await authService.register(formData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        setIsAuthenticated(true);
        
        // Get user data
        const userData = await authService.getUser();
        setUser(userData);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = await authService.getUser();
          setUser(userData);
          setIsAuthenticated(true);
          setError(null);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          setError('Session expired. Please login again.');
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 
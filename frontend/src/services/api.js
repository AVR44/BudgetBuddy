import axios from 'axios';

const API_URL = 'http://localhost:2000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Expense API calls
export const expenseService = {
  // Get all expenses
  getExpenses: async () => {
    try {
      const response = await api.get('/expenses');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching expenses' };
    }
  },

  // Add new expense
  addExpense: async (expenseData) => {
    try {
      const response = await api.post('/expenses', expenseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error adding expense' };
    }
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    try {
      const response = await api.put(`/expenses/${id}`, expenseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating expense' };
    }
  },

  // Delete expense
  deleteExpense: async (id) => {
    try {
      const response = await api.delete(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error deleting expense' };
    }
  }
};

// Budget API calls
export const budgetService = {
  // Get user's budget
  getBudget: async () => {
    try {
      const response = await api.get('/budgets');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching budget' };
    }
  },

  // Update budget
  updateBudget: async (budgetData) => {
    try {
      const response = await api.post('/budgets', budgetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating budget' };
    }
  }
};

// Auth API calls
export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error registering user' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error logging in' };
    }
  },

  // Get user data
  getUser: async () => {
    try {
      const response = await api.get('/auth/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching user data' };
    }
  }
};

export default api; 
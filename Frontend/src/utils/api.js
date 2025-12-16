// API configuration utility
export const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

// Common API error handler
export const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
  console.error('API Error:', error);
  return error.response?.data?.message || fallbackMessage;
};

// Get auth token from localStorage
export const getAuthToken = () => localStorage.getItem('token');

// Common headers for authenticated requests
export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json'
});
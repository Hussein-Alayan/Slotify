import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api', 
  withCredentials: true, // For cookies/auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for auth/error handling
api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default api;

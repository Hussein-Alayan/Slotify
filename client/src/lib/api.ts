// Utility to get CSRF cookie before auth requests
export async function csrf() {
  await axios.get(
    (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000') + '/sanctum/csrf-cookie',
    { withCredentials: true }
  );
}
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

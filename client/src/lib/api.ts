// Utility to get CSRF cookie before auth requests
export async function csrf() {
  await axios.get(
    (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000') + '/sanctum/csrf-cookie',
    { withCredentials: true }
  );
}
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api', 
  withCredentials: true, // For cookies/auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to set X-XSRF-TOKEN header from cookie
api.interceptors.request.use(config => {
  const xsrfToken = Cookies.get('XSRF-TOKEN');
  if (!config.headers) config.headers = {};
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = xsrfToken;
  }
  return config;
});

// Add interceptors for auth/error handling
api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default api;

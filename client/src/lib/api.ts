
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
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/signin";
      }
    }
    return Promise.reject(error);
  }
);

// Helper to start a call and get a call_id from FastAPI
export async function fetchCallId(
  caller_phone = "test",
  business_id = "",
  client_id = ""
): Promise<string> {
  const body: {
    caller_phone: string;
    business_id: string;
    client_id?: number;
  } = {
    caller_phone,
    business_id,
  };
  
  if (client_id) {
    body.client_id = parseInt(client_id, 10);
  }

  const resp = await fetch("http://localhost:8001/incoming/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  
  const data = await resp.json();
  return data.call_id;
}

// Helper to fetch all businesses for dropdown
export async function fetchBusinesses(): Promise<Array<{id: number, name: string}>> {
  try {
  const response = await api.get('/v1/businesses/public/list');
    const responseData = response.data as { data: Array<{id: number, name: string}> };
    return responseData.data; // ApiResponseTrait wraps data in 'data' property
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
}

export default api;

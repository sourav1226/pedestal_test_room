import axios from 'axios';
import { API_BASE_URL } from '../constants';

const TOKEN_KEY = 'quiz_app_access_token';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('quiz_app_refresh_token');
      localStorage.removeItem('quiz_app_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { apiClient };

export function handleApiError(error) {
  const message = error.response?.data?.error || error.message || 'An error occurred';
  console.error('API Error:', message, error);
  return { success: false, error: message };
}

function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function transformKeys(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(transformKeys);
  if (typeof obj !== 'object') return obj;
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = toCamelCase(key);
    acc[camelKey] = transformKeys(obj[key]);
    return acc;
  }, {});
}

export class ApiService {
  constructor() {
    this.client = apiClient;
  }

  async handleResponse(response) {
    return { success: true, data: response.data };
  }
}

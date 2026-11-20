import axios from 'axios';

/**
 * SheNova Central Axios API Client
 * Configured with base URL from VITE_API_URL, automatic Bearer JWT injection,
 * and 401 response interceptor for session expiration and automatic logout.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shenova_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized by logging out
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute =
        error.config.url.includes('/auth/login') ||
        error.config.url.includes('/auth/signup') ||
        error.config.url.includes('/auth/forgot-password') ||
        error.config.url.includes('/auth/me');

      if (!isAuthRoute) {
        console.warn('[API Client] 401 Unauthorized received. Clearing session...');
        localStorage.removeItem('shenova_auth_token');
        localStorage.removeItem('shenova_auth_user');

        // Broadcast unauthorized event for React state handlers
        window.dispatchEvent(new CustomEvent('shenova:unauthorized'));

        // If not already on an auth page, redirect to login
        const currentPath = window.location.pathname;
        if (!['/login', '/signup', '/forgot-password', '/'].includes(currentPath)) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

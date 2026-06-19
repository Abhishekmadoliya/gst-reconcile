import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  // withCredentials: true ensures that httpOnly cookies (like accessToken and refreshToken)
  // are automatically sent with every request to the backend.
  withCredentials: true,
});

// State for token refresh queueing
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for catching 401s and refreshing tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the refresh or login endpoint itself returns a 401, don't try to refresh again
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh endpoint. The browser will automatically attach the refreshToken cookie.
        await api.post('/auth/refresh');
        
        // Once refreshed, process the queued requests and retry the original failed request
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails (e.g., refresh token expired), clear the queue and redirect
        processQueue(refreshError);
        
        // Client-side redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

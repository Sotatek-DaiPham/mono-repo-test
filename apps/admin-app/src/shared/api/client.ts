// Axios API client with interceptors

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config';
import { storage } from '../lib/utils/storage';
import { handleApiError } from '../lib/utils/errors';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const apiException = handleApiError(error);
    
    // Handle 401 Unauthorized - Clear auth and redirect to login
    if (apiException.statusCode === 401) {
      storage.clearAuth();
      // Redirect will be handled by auth guard/route protection
      window.location.href = '/login';
    }

    return Promise.reject(apiException);
  }
);


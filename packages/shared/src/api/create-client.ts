// API client factory

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiException, handleApiError } from '../utils/errors';

export interface ApiClientConfig {
  baseURL: string;
  getToken: () => string | null;
  onUnauthorized?: () => void;
}

export const createApiClient = (config: ApiClientConfig): AxiosInstance => {
  const client: AxiosInstance = axios.create({
    baseURL: config.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      const token = config.getToken();
      if (token && requestConfig.headers) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const apiException = handleApiError(error);
      
      // Handle 401 Unauthorized
      if (apiException.statusCode === 401 && config.onUnauthorized) {
        config.onUnauthorized();
      }

      return Promise.reject(apiException);
    }
  );

  return client;
};


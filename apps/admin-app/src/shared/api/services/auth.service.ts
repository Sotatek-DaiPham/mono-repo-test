// Auth API service

import { apiClient } from '../client';
import { LoginRequest, LoginResponse } from '../../lib/types';
import { API_ENDPOINTS } from '../../constants';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },
};


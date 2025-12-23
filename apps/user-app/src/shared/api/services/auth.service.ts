// Auth API service

import { apiClient } from '../client';
import { LoginRequest, RegisterRequest, LoginResponse } from '../../lib/types';
import { API_ENDPOINTS } from '../../constants';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ id: string; email: string; role: string; tier: string }> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },
};


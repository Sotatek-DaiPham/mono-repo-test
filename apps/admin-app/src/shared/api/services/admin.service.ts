// Admin API service

import { apiClient } from '../client';
import { User, UserDetail } from '@/entities/user';
import { UserListQueryParams, UserListResponse, UpdateTierRequest } from '../../lib/types';
import { API_ENDPOINTS } from '../../constants';

export const adminService = {
  getUsers: async (params?: UserListQueryParams): Promise<UserListResponse> => {
    const response = await apiClient.get<UserListResponse>(API_ENDPOINTS.ADMIN.USERS, { params });
    return response.data;
  },

  getUserById: async (id: string): Promise<UserDetail> => {
    const response = await apiClient.get<UserDetail>(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
    return response.data;
  },

  updateUserTier: async (id: string, data: UpdateTierRequest): Promise<User> => {
    const response = await apiClient.put<User>(API_ENDPOINTS.ADMIN.UPDATE_TIER(id), data);
    return response.data;
  },

  banUser: async (id: string): Promise<User> => {
    const response = await apiClient.post<User>(API_ENDPOINTS.ADMIN.BAN_USER(id));
    return response.data;
  },

  unbanUser: async (id: string): Promise<User> => {
    const response = await apiClient.post<User>(API_ENDPOINTS.ADMIN.UNBAN_USER(id));
    return response.data;
  },
};


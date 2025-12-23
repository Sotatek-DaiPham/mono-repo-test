// API request/response types

import { User, UserDetail, UserTier } from '@/entities/user';

// Auth API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    tier: string;
  };
}

// Admin API
export interface UserListQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'email' | 'role' | 'tier';
  sortOrder?: 'ASC' | 'DESC';
  role?: string;
  tier?: string;
  isBanned?: boolean;
  search?: string;
}

export interface UserListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdateTierRequest {
  tier: UserTier;
}

// API Error response
export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}


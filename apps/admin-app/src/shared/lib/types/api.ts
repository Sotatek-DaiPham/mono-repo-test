// API request/response types

import { User, UserTier } from '@/entities/user';
import { LoginRequest, LoginResponse } from '@repo/shared';

// Re-export common types from shared
export type { LoginRequest, LoginResponse };

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

// Re-export ApiError from shared
export type { ApiError } from '@repo/shared';


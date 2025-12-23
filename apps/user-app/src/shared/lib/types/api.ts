// API request/response types

import { User, Todo, TodoStatus, TodoPriority } from '@/entities';
import { LoginRequest, RegisterRequest, LoginResponse } from '@repo/shared';

// Re-export common types from shared
export type { LoginRequest, RegisterRequest, LoginResponse };

// Todo API
export interface CreateTodoRequest {
  title: string;
  status?: TodoStatus;
  dueDate?: string | null;
  priority?: TodoPriority | null;
}

export interface UpdateTodoRequest {
  title?: string;
  status?: TodoStatus;
  dueDate?: string | null;
  priority?: TodoPriority | null;
}

// Admin API
export interface UserListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserDetailResponse extends User {
  todosCount?: number;
}

export interface UpdateTierRequest {
  tier: string;
}

// Re-export ApiError from shared
export type { ApiError } from '@repo/shared';

// Common API response wrapper
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}


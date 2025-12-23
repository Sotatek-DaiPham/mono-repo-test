// Common API types

// Auth API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
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

// Common API response wrapper
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}


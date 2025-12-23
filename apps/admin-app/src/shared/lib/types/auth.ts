// Auth-related types

import { UserRole, UserTier } from '@/entities/user';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  tier: UserTier;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}


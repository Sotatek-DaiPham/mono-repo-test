// Auth store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, AuthState } from '../types/auth';
import { storage } from '../utils/storage';
import { authService } from '@/shared/api';
import { LoginRequest, RegisterRequest } from '../types';
import { UserRole, UserTier } from '@/entities/user';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials: LoginRequest) => {
        const response = await authService.login(credentials);
        const user: AuthUser = {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role as UserRole,
          tier: response.user.tier as UserTier,
        };
        
        storage.setToken(response.access_token);
        storage.setUser(user);
        
        set({
          user,
          token: response.access_token,
          isAuthenticated: true,
        });
      },

      register: async (data: RegisterRequest) => {
        await authService.register(data);
        // After registration, automatically login
        await useAuthStore.getState().login(data);
      },

      logout: () => {
        storage.clearAuth();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: AuthUser, token: string) => {
        storage.setToken(token);
        storage.setUser(user);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        storage.clearAuth();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);


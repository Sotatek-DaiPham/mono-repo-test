// API client using shared factory

import { createApiClient } from '@repo/shared';
import { API_BASE_URL } from '../config';
import { storage } from '../lib/utils/storage';
import { useAuthStore } from '../lib/store/auth.store';
import { ROUTES } from '../constants/routes';

export const apiClient = createApiClient({
  baseURL: API_BASE_URL,
  getToken: () => storage.getToken(),
  onUnauthorized: () => {
    // Logout from Zustand store (clears state and storage)
    useAuthStore.getState().logout();
    
    // Redirect to login page if not already there
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== ROUTES.LOGIN && currentPath !== ROUTES.REGISTER) {
        window.location.href = ROUTES.LOGIN;
      }
    }
  },
});

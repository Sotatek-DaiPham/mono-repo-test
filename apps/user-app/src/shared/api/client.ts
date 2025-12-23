// API client using shared factory

import { createApiClient } from '@repo/shared';
import { API_BASE_URL } from '../config';
import { storage } from '../lib/utils/storage';

export const apiClient = createApiClient({
  baseURL: API_BASE_URL,
  getToken: () => storage.getToken(),
  onUnauthorized: () => {
    storage.clearAuth();
    // Redirect will be handled by auth guard/route protection in Next.js
  },
});

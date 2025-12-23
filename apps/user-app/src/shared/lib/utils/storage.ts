// LocalStorage utilities - using shared package with app-specific config

import { createStorage } from '@repo/shared';

export const storage = createStorage({
  tokenKey: 'auth_token',
  userKey: 'auth_user',
});

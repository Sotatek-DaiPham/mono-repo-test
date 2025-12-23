// LocalStorage utilities - using shared package with app-specific config

import { createStorage } from '@repo/shared';

export const storage = createStorage({
  tokenKey: 'admin_auth_token',
  userKey: 'admin_auth_user',
});

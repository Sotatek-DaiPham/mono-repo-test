// LocalStorage utilities with type safety

const STORAGE_KEYS = {
  AUTH_TOKEN: 'admin_auth_token',
  AUTH_USER: 'admin_auth_user',
} as const;

export const storage = {
  // Token
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // User
  getUser: <T>(): T | null => {
    const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return user ? JSON.parse(user) : null;
  },

  setUser: <T>(user: T): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },

  // Clear all auth data
  clearAuth: (): void => {
    storage.removeToken();
    storage.removeUser();
  },
};


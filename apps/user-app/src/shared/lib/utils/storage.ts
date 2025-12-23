// LocalStorage utilities with type safety

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
} as const;

export const storage = {
  // Token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // User
  getUser: <T>(): T | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return user ? JSON.parse(user) : null;
  },

  setUser: <T>(user: T): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  },

  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },

  // Clear all auth data
  clearAuth: (): void => {
    storage.removeToken();
    storage.removeUser();
  },
};


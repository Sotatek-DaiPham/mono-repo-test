// LocalStorage utilities with type safety and configurable keys

// Type declarations for browser-only APIs
declare const window: Window | undefined;
declare const localStorage: Storage | undefined;

export interface StorageConfig {
  tokenKey: string;
  userKey: string;
}

const createStorage = (config: StorageConfig) => ({
  // Token
  getToken: (): string | null => {
    if (typeof window === 'undefined' || !localStorage) return null;
    return localStorage.getItem(config.tokenKey);
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined' || !localStorage) return;
    localStorage.setItem(config.tokenKey, token);
  },

  removeToken: (): void => {
    if (typeof window === 'undefined' || !localStorage) return;
    localStorage.removeItem(config.tokenKey);
  },

  // User
  getUser: <T>(): T | null => {
    if (typeof window === 'undefined' || !localStorage) return null;
    const user = localStorage.getItem(config.userKey);
    return user ? JSON.parse(user) : null;
  },

  setUser: <T>(user: T): void => {
    if (typeof window === 'undefined' || !localStorage) return;
    localStorage.setItem(config.userKey, JSON.stringify(user));
  },

  removeUser: (): void => {
    if (typeof window === 'undefined' || !localStorage) return;
    localStorage.removeItem(config.userKey);
  },

  // Clear all auth data
  clearAuth: (): void => {
    if (typeof window === 'undefined' || !localStorage) return;
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem(config.userKey);
  },
});

export { createStorage };


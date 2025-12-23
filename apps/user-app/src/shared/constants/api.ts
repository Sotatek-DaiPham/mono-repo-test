// API endpoints

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  TODOS: {
    BASE: '/todos',
    BY_ID: (id: string) => `/todos/${id}`,
  },
} as const;


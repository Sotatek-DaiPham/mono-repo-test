// API endpoints

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
    UPDATE_TIER: (id: string) => `/admin/users/${id}/tier`,
    BAN_USER: (id: string) => `/admin/users/${id}/ban`,
    UNBAN_USER: (id: string) => `/admin/users/${id}/unban`,
  },
} as const;


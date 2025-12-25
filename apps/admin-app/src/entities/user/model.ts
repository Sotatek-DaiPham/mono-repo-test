// User entity model

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserTier {
  NORMAL = 'normal',
  PREMIUM = 'premium',
  PRO = 'pro',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  tier: UserTier;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail extends User {
  todosCount?: number;
  notesCount?: number;
}


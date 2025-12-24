/**
 * Socket.IO Event Types
 * Shared types for real-time communication between backend and clients
 */

/**
 * Socket event names
 */
export enum SocketEvents {
  // Client → Server
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',

  // Server → Client (User Events)
  USER_BANNED = 'user.banned',
  USER_UNBANNED = 'user.unbanned',
  USER_TIER_UPDATED = 'user.tier.updated',
}

/**
 * Payload for user.banned event
 */
export interface UserBannedPayload {
  userId: string;
  message: string;
  timestamp: string;
}

/**
 * Payload for user.unbanned event
 */
export interface UserUnbannedPayload {
  userId: string;
  message: string;
  timestamp: string;
}

/**
 * Payload for user.tier.updated event
 */
export interface UserTierUpdatedPayload {
  userId: string;
  newTier: string;
  oldTier: string;
  message: string;
  timestamp: string;
}

/**
 * Union type for all user event payloads
 */
export type UserEventPayload =
  | UserBannedPayload
  | UserUnbannedPayload
  | UserTierUpdatedPayload;

/**
 * Socket connection options
 */
export interface SocketConnectionOptions {
  token: string;
  userId: string;
}


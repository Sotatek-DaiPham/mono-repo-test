import { io, Socket } from 'socket.io-client';
import {
  SocketEvents,
  UserBannedPayload,
  UserUnbannedPayload,
  UserTierUpdatedPayload,
} from '@repo/shared';
import { API_BASE_URL } from '@/shared/config';

/**
 * Socket connection states
 */
export enum SocketConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

/**
 * Socket Service - Singleton pattern
 * Manages Socket.IO connection with auto-reconnect and event handling
 */
class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private maxReconnectDelay = 30000; // Max 30 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connectionState: SocketConnectionState =
    SocketConnectionState.DISCONNECTED;
  private eventListeners = new Map<string, Set<Function>>();

  /**
   * Get current connection state
   */
  get state(): SocketConnectionState {
    return this.connectionState;
  }

  /**
   * Check if socket is connected
   */
  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Connect to socket server with JWT authentication
   */
  connect(token: string): void {
    // Disconnect existing connection if any
    if (this.socket) {
      this.disconnect();
    }

    // Only connect in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    this.updateConnectionState(SocketConnectionState.CONNECTING);

    // Create socket connection with auth token
    this.socket = io(API_BASE_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: false, // Manual reconnection handling
      autoConnect: true,
    });

    this.setupEventHandlers();
  }

  /**
   * Setup socket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection successful
    this.socket.on(SocketEvents.CONNECT, () => {
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.updateConnectionState(SocketConnectionState.CONNECTED);
      this.clearReconnectTimer();
    });

    // Connection error
    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.updateConnectionState(SocketConnectionState.ERROR);
      this.handleReconnect();
    });

    // Disconnection
    this.socket.on(SocketEvents.DISCONNECT, (reason) => {
      console.log('Socket disconnected:', reason);
      this.updateConnectionState(SocketConnectionState.DISCONNECTED);

      // Only reconnect if not manually disconnected
      if (reason !== 'io client disconnect') {
        this.handleReconnect();
      }
    });

    // Error event from server
    this.socket.on('error', (error: { type: string; message: string }) => {
      console.error('Socket error:', error);
      this.updateConnectionState(SocketConnectionState.ERROR);
    });

    // Forward server events to registered listeners
    this.socket.on(SocketEvents.USER_BANNED, (payload: UserBannedPayload) => {
      this.emitToListeners(SocketEvents.USER_BANNED, payload);
    });

    this.socket.on(
      SocketEvents.USER_UNBANNED,
      (payload: UserUnbannedPayload) => {
        this.emitToListeners(SocketEvents.USER_UNBANNED, payload);
      },
    );

    this.socket.on(
      SocketEvents.USER_TIER_UPDATED,
      (payload: UserTierUpdatedPayload) => {
        this.emitToListeners(SocketEvents.USER_TIER_UPDATED, payload);
      },
    );
  }

  /**
   * Handle reconnection with exponential backoff
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.updateConnectionState(SocketConnectionState.ERROR);
      return;
    }

    this.updateConnectionState(SocketConnectionState.RECONNECTING);
    this.reconnectAttempts++;

    // Calculate delay with exponential backoff
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay,
    );

    this.reconnectTimer = setTimeout(() => {
      if (this.socket && !this.socket.connected) {
        const token = this.getTokenFromStorage();
        if (token) {
          this.socket.connect();
        } else {
          // No token, stop reconnecting
          this.updateConnectionState(SocketConnectionState.DISCONNECTED);
        }
      }
    }, delay);
  }

  /**
   * Get token from storage
   */
  private getTokenFromStorage(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth-storage')
      ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token
      : null;
  }

  /**
   * Clear reconnect timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Update connection state
   */
  private updateConnectionState(state: SocketConnectionState): void {
    this.connectionState = state;
    // Emit state change to listeners if needed
    this.emitToListeners('connection_state_change', state);
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    this.clearReconnectTimer();
    this.reconnectAttempts = 0;

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.updateConnectionState(SocketConnectionState.DISCONNECTED);
    this.eventListeners.clear();
  }

  /**
   * Register event listener
   */
  on<T = any>(event: string, callback: (data: T) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.eventListeners.delete(event);
        }
      }
    };
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  /**
   * Emit event to registered listeners
   */
  private emitToListeners(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();


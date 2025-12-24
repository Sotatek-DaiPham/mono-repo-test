'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { socketService, SocketConnectionState } from './socket.service';
import { useAuthStore } from '../store/auth.store';

/**
 * Socket Context
 */
interface SocketContextValue {
  connectionState: SocketConnectionState;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue | null>(null);

/**
 * Socket Provider Component
 * Manages socket connection lifecycle based on authentication state
 */
export function SocketProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const connectionState = socketService.state;
  const isConnected = socketService.isConnected;

  // Connect socket when authenticated
  useEffect(() => {
    if (isAuthenticated && token && !isConnected) {
      socketService.connect(token);
    }
  }, [isAuthenticated, token, isConnected]);

  // Disconnect socket when logged out
  useEffect(() => {
    if (!isAuthenticated) {
      socketService.disconnect();
    }
  }, [isAuthenticated]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't disconnect on unmount, let it persist across route changes
      // Only disconnect on explicit logout
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        connectionState,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

/**
 * Hook to access socket context
 */
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}

/**
 * Hook to listen to socket events
 * @param event - Event name
 * @param handler - Event handler function
 * @returns Unsubscribe function
 */
export function useSocketEvent<T = any>(
  event: string,
  handler: (data: T) => void,
) {
  useEffect(() => {
    const unsubscribe = socketService.on<T>(event, handler);
    return unsubscribe;
  }, [event, handler]);
}


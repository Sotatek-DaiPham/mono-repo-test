'use client';

import { useRouter } from 'next/navigation';
import { useSocketEvent } from './socket-provider';
import { socketService } from './socket.service';
import { useAuthStore } from '../store/auth.store';
import { useNotificationStore } from '../store/notification.store';
import { ROUTES } from '@/shared/constants/routes';
import { SocketEvents, UserBannedPayload, UserTierUpdatedPayload } from '@repo/shared';
import { toast } from 'sonner';

/**
 * Socket Event Handler Component
 * Handles real-time socket events (ban, unban, tier update)
 */
export function SocketEventHandler() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  // Handle user.banned event - Critical: Force logout
  useSocketEvent<UserBannedPayload>(SocketEvents.USER_BANNED, (payload) => {
    // Disconnect socket immediately
    socketService.disconnect();

    // Logout user
    logout();

    // Show error toast
    toast.error(payload.message || 'Your account has been banned by an administrator.');

    // Redirect to login page
    router.push(ROUTES.LOGIN);
  });

  // Handle user.unbanned event - Informational only
  useSocketEvent<UserBannedPayload>(SocketEvents.USER_UNBANNED, (payload) => {
    toast.info(payload.message || 'Your account has been unbanned. You can now log in again.');
  });

  // Handle user.tier.updated event - Update user tier and show notification
  useSocketEvent<UserTierUpdatedPayload>(SocketEvents.USER_TIER_UPDATED, (payload) => {
    if (user && payload.userId === user.id) {
      // Update user tier in store
      const updatedUser = {
        ...user,
        tier: payload.newTier as typeof user.tier,
      };
      
      // Get token from store
      const token = useAuthStore.getState().token;
      if (token) {
        setUser(updatedUser, token);
      }

      // Add to global notification store (for notification bell)
      useNotificationStore.getState().addNotification({
        type: 'success',
        title: 'Plan Updated',
        message: payload.message || `Your plan has been updated to ${payload.newTier}.`,
        source: 'socket',
        metadata: {
          newTier: payload.newTier,
          oldTier: payload.oldTier,
        },
      });

      // Optional: Still show toast for immediate feedback
      toast.success(payload.message || `Your plan has been updated to ${payload.newTier}.`);
    }
  });

  // Component doesn't render anything
  return null;
}


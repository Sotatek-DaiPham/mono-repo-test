// Tier permission utilities

import { UserTier } from '@/entities/user';

export interface TierFeatures {
  canSetDueDate: boolean;
  canSetPriority: boolean;
  canUseAdvancedFilters: boolean;
  canUploadImages: boolean;
}

export interface TierLimits {
  maxTodos: number;
  maxNotes: number;
}

export const TIER_FEATURES: Record<UserTier, TierFeatures> = {
  [UserTier.NORMAL]: {
    canSetDueDate: false,
    canSetPriority: false,
    canUseAdvancedFilters: false,
    canUploadImages: false,
  },
  [UserTier.PREMIUM]: {
    canSetDueDate: true,
    canSetPriority: false,
    canUseAdvancedFilters: false,
    canUploadImages: true,
  },
  [UserTier.PRO]: {
    canSetDueDate: true,
    canSetPriority: true,
    canUseAdvancedFilters: true,
    canUploadImages: true,
  },
};

export const TIER_LIMITS: Record<UserTier, TierLimits> = {
  [UserTier.NORMAL]: {
    maxTodos: 10,
    maxNotes: 2,
  },
  [UserTier.PREMIUM]: {
    maxTodos: 50,
    maxNotes: 3,
  },
  [UserTier.PRO]: {
    maxTodos: Infinity,
    maxNotes: 4,
  },
};

export function canUserUseFeature(tier: UserTier, feature: keyof TierFeatures): boolean {
  return TIER_FEATURES[tier][feature];
}

export function getRequiredTierForFeature(feature: keyof TierFeatures): UserTier {
  if (feature === 'canSetDueDate') return UserTier.PREMIUM;
  if (feature === 'canSetPriority') return UserTier.PRO;
  if (feature === 'canUploadImages') return UserTier.PREMIUM;
  return UserTier.NORMAL;
}

export function getTierDisplayName(tier: UserTier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

export function getTierLimits(tier: UserTier): TierLimits {
  return TIER_LIMITS[tier];
}

export function hasReachedNoteLimit(tier: UserTier, currentCount: number): boolean {
  const limits = getTierLimits(tier);
  return limits.maxNotes !== Infinity && currentCount >= limits.maxNotes;
}


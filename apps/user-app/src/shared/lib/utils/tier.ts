// Tier permission utilities

import { UserTier } from '@/entities/user';

export interface TierFeatures {
  canSetDueDate: boolean;
  canSetPriority: boolean;
  canUseAdvancedFilters: boolean;
}

export const TIER_FEATURES: Record<UserTier, TierFeatures> = {
  [UserTier.NORMAL]: {
    canSetDueDate: false,
    canSetPriority: false,
    canUseAdvancedFilters: false,
  },
  [UserTier.PREMIUM]: {
    canSetDueDate: true,
    canSetPriority: false,
    canUseAdvancedFilters: false,
  },
  [UserTier.PRO]: {
    canSetDueDate: true,
    canSetPriority: true,
    canUseAdvancedFilters: true,
  },
};

export function canUserUseFeature(tier: UserTier, feature: keyof TierFeatures): boolean {
  return TIER_FEATURES[tier][feature];
}

export function getRequiredTierForFeature(feature: keyof TierFeatures): UserTier {
  if (feature === 'canSetDueDate') return UserTier.PREMIUM;
  if (feature === 'canSetPriority') return UserTier.PRO;
  return UserTier.NORMAL;
}

export function getTierDisplayName(tier: UserTier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}


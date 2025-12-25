import { UserTier } from '../../entities/user.entity';

export interface TierRestrictions {
  maxTodos: number;
  maxNotes: number;
  features: {
    canSetDueDate: boolean;
    canSetPriority: boolean;
    canUseAdvancedFilters: boolean;
    canUploadImages: boolean;
  };
}

export const TIER_RESTRICTIONS: Record<UserTier, TierRestrictions> = {
  [UserTier.NORMAL]: {
    maxTodos: 10,
    maxNotes: 10,
    features: {
      canSetDueDate: false,
      canSetPriority: false,
      canUseAdvancedFilters: false,
      canUploadImages: false,
    },
  },
  [UserTier.PREMIUM]: {
    maxTodos: 50,
    maxNotes: Infinity,
    features: {
      canSetDueDate: true,
      canSetPriority: false,
      canUseAdvancedFilters: false,
      canUploadImages: true,
    },
  },
  [UserTier.PRO]: {
    maxTodos: Infinity,
    maxNotes: Infinity,
    features: {
      canSetDueDate: true,
      canSetPriority: true,
      canUseAdvancedFilters: true,
      canUploadImages: true,
    },
  },
};


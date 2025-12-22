import { UserTier } from '../../entities/user.entity';

export interface TierRestrictions {
  maxTodos: number;
  features: {
    canSetDueDate: boolean;
    canSetPriority: boolean;
    canUseAdvancedFilters: boolean;
  };
}

export const TIER_RESTRICTIONS: Record<UserTier, TierRestrictions> = {
  [UserTier.NORMAL]: {
    maxTodos: 10,
    features: {
      canSetDueDate: false,
      canSetPriority: false,
      canUseAdvancedFilters: false,
    },
  },
  [UserTier.PREMIUM]: {
    maxTodos: 50,
    features: {
      canSetDueDate: true,
      canSetPriority: false,
      canUseAdvancedFilters: false,
    },
  },
  [UserTier.PRO]: {
    maxTodos: Infinity,
    features: {
      canSetDueDate: true,
      canSetPriority: true,
      canUseAdvancedFilters: true,
    },
  },
};


import { UserTier } from '../../entities/user.entity';
import { TIER_RESTRICTIONS, TierRestrictions } from '../config/tier-restrictions.config';

export function getTierRestrictions(tier: UserTier): TierRestrictions {
  return TIER_RESTRICTIONS[tier];
}

export function canUserPerformAction(tier: UserTier, action: keyof TierRestrictions['features']): boolean {
  const restrictions = getTierRestrictions(tier);
  return restrictions.features[action];
}

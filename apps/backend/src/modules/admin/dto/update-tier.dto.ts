import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserTier } from '../../../entities/user.entity';

export class UpdateTierDto {
  @ApiProperty({ enum: UserTier, description: 'New tier for the user' })
  @IsEnum(UserTier)
  tier: UserTier;
}


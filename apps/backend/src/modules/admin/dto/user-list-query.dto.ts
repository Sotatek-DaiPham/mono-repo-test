import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { UserRole, UserTier } from '../../../entities/user.entity';

export class UserListQueryDto extends PaginationDto {
  @ApiProperty({ required: false, enum: ['createdAt', 'email', 'role', 'tier'], description: 'Sort field (flat)' })
  @IsOptional()
  @IsEnum(['createdAt', 'email', 'role', 'tier'])
  sortBy?: string;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], description: 'Sort order (flat)' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @ApiProperty({ required: false, enum: UserRole, description: 'Filter by role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ required: false, enum: UserTier, description: 'Filter by tier' })
  @IsOptional()
  @IsEnum(UserTier)
  tier?: UserTier;

  @ApiProperty({ required: false, description: 'Filter by banned status' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isBanned?: boolean;

  @ApiProperty({ required: false, description: 'Search term (searches in email)' })
  @IsOptional()
  @IsString()
  search?: string;
}


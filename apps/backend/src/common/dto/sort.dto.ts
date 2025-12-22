import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

export class SortDto {
  @ApiProperty({ required: false, enum: ['createdAt', 'email', 'role', 'tier'], default: 'createdAt', description: 'Field to sort by' })
  @IsOptional()
  @IsEnum(['createdAt', 'email', 'role', 'tier'])
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'DESC', description: 'Sort order' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}


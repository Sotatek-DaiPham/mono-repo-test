import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchDto {
  @ApiProperty({ required: false, description: 'Search term (searches in email)' })
  @IsOptional()
  @IsString()
  search?: string;
}


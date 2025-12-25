import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class NoteListQueryDto {
  @ApiProperty({ example: 'search term', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}


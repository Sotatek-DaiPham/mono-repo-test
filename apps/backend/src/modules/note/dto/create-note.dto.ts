import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ example: 'My Note Title', required: false })
  @IsOptional()
  @IsString()
  title?: string | null;

  @ApiProperty({ example: '<p>Note content here</p>', required: false, default: '' })
  @IsOptional()
  @IsString()
  content?: string;
}


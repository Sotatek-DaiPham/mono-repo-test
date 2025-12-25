import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({ example: 'My Note Title', required: false })
  @IsOptional()
  @IsString()
  title?: string | null;

  @ApiProperty({ example: '<p>Updated note content</p>', required: false })
  @IsOptional()
  @IsString()
  content?: string;
}


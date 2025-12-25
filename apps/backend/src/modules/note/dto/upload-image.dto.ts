import { ApiProperty } from '@nestjs/swagger';

export class UploadImageResponseDto {
  @ApiProperty({ example: 'https://res.cloudinary.com/...' })
  url: string;

  @ApiProperty({ example: 'notes/abc123' })
  publicId: string;
}


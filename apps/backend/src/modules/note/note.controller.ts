import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteListQueryDto } from './dto/note-list-query.dto';
import { UploadImageResponseDto } from './dto/upload-image.dto';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { UserService } from '../user/user.service';
import { getTierRestrictions } from '../../common/utils/tier.utils';

@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NoteController {
  constructor(
    private noteService: NoteService,
    private cloudinaryService: CloudinaryService,
    private userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of notes' })
  async findAll(@Query() query: NoteListQueryDto, @Request() req) {
    return this.noteService.findAllByUserId(req.user.userId, query.search);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get note count for authenticated user' })
  @ApiResponse({ status: 200, description: 'Note count' })
  async getCount(@Request() req) {
    const count = await this.noteService.getNoteCount(req.user.userId);
    return { count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiResponse({ status: 200, description: 'Note found' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const note = await this.noteService.findOne(id, req.user.userId);
    if (!note) {
      return { message: 'Note not found' };
    }
    return note;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.noteService.create(req.user.userId, createNoteDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note (full update)' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req,
  ) {
    const note = await this.noteService.update(id, req.user.userId, updateNoteDto);
    if (!note) {
      return { message: 'Note not found' };
    }
    return note;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partial update a note (optimized for auto-save)' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async partialUpdate(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req,
  ) {
    const note = await this.noteService.update(id, req.user.userId, updateNoteDto);
    if (!note) {
      return { message: 'Note not found' };
    }
    return note;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 204, description: 'Note deleted successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async delete(@Param('id') id: string, @Request() req) {
    const deleted = await this.noteService.delete(id, req.user.userId);
    if (!deleted) {
      return { message: 'Note not found' };
    }
    return;
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image for note (Premium/Pro only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully', type: UploadImageResponseDto })
  @ApiResponse({ status: 403, description: 'Image upload not available for your tier' })
  @ApiResponse({ status: 400, description: 'Invalid file or no file provided' })
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req) {
    // Check if file is provided
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only images (JPEG, PNG, GIF, WebP) are allowed');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB');
    }

    // Check user tier
    const user = await this.userService.findOne(req.user.userId);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const restrictions = getTierRestrictions(user.tier);
    if (!restrictions.features.canUploadImages) {
      throw new ForbiddenException(
        `Image upload is not available for ${user.tier} tier. Upgrade to Premium or Pro.`,
      );
    }

    // Upload to Cloudinary
    try {
      const result = await this.cloudinaryService.uploadImage(file, 'notes');
      return result;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to upload image',
      );
    }
  }
}


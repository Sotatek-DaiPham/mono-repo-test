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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteListQueryDto } from './dto/note-list-query.dto';

@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

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
}


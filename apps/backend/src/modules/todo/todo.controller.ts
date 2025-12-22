import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
  ApiProperty,
} from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TodoService } from './todo.service';
import { Todo, TodoStatus } from '../../entities/todo.entity';

export class CreateTodoDto {
  @ApiProperty({ example: 'Complete project documentation' })
  @IsString()
  title: string;

  @ApiProperty({ enum: TodoStatus, required: false, default: TodoStatus.TODO })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: Date | null;
}

export class UpdateTodoDto {
  @ApiProperty({ example: 'Complete project documentation', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ enum: TodoStatus, required: false })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: Date | null;
}

@ApiTags('todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Get all todos for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of todos' })
  async findAll(@Request() req) {
    return this.todoService.findAllByUserId(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiResponse({ status: 200, description: 'Todo found' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const todo = await this.todoService.findOne(id, req.user.userId);
    if (!todo) {
      return { message: 'Todo not found' };
    }
    return todo;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'Todo created successfully' })
  async create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    return this.todoService.create(req.user.userId, createTodoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ) {
    const todo = await this.todoService.update(id, req.user.userId, updateTodoDto);
    if (!todo) {
      return { message: 'Todo not found' };
    }
    return todo;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: 204, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async delete(@Param('id') id: string, @Request() req) {
    const deleted = await this.todoService.delete(id, req.user.userId);
    if (!deleted) {
      return { message: 'Todo not found' };
    }
    return;
  }
}


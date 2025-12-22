import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { UpdateTierDto } from './dto/update-tier.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('test')
  @ApiOperation({ summary: 'Test admin access' })
  @ApiResponse({ status: 200, description: 'Admin access confirmed' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async testAdminAccess(@Request() req) {
    return {
      message: 'Admin access confirmed',
      user: req.user,
    };
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users with filter, sort, search, and pagination' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async findAllUsers(@Query() query: UserListQueryDto) {
    return this.adminService.findAllUsers(query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user detail by ID' })
  @ApiResponse({ status: 200, description: 'User detail' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async findUserById(@Param('id') id: string) {
    return this.adminService.findUserById(id);
  }

  @Put('users/:id/tier')
  @ApiOperation({ summary: 'Update user tier' })
  @ApiResponse({ status: 200, description: 'User tier updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async updateUserTier(@Param('id') id: string, @Body() updateTierDto: UpdateTierDto) {
    return this.adminService.updateUserTier(id, updateTierDto.tier);
  }

  @Post('users/:id/ban')
  @ApiOperation({ summary: 'Ban a user' })
  @ApiResponse({ status: 200, description: 'User banned' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async banUser(@Param('id') id: string) {
    return this.adminService.banUser(id);
  }

  @Post('users/:id/unban')
  @ApiOperation({ summary: 'Unban a user' })
  @ApiResponse({ status: 200, description: 'User unbanned' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }
}


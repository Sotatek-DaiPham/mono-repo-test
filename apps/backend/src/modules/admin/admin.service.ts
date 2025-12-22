import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserTier } from '../../entities/user.entity';
import { UserService } from '../user/user.service';
import { UserListQueryDto } from './dto/user-list-query.dto';

@Injectable()
export class AdminService {
  constructor(
    private userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllUsers(query: UserListQueryDto) {
    const { page = 1, limit = 10, sortBy: flatSortBy, sortOrder: flatSortOrder, role, tier, isBanned, search } =
      query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Search by email
    if (search) {
      queryBuilder.where('user.email ILIKE :search', { search: `%${search}%` });
    }

    // Filter by role
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Filter by tier
    if (tier) {
      queryBuilder.andWhere('user.tier = :tier', { tier });
    }

    // Filter by isBanned
    if (isBanned !== undefined) {
      queryBuilder.andWhere('user.isBanned = :isBanned', { isBanned });
    }

    // Sort - validate allowed fields to prevent SQL injection
    const allowedSortFields = ['createdAt', 'email', 'role', 'tier'];
    const sortBy = flatSortBy && allowedSortFields.includes(flatSortBy) ? flatSortBy : 'createdAt';
    const sortOrder = flatSortOrder === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    // Pagination
    queryBuilder.skip(skip).take(limit);

    // Exclude password from results
    queryBuilder.select([
      'user.id',
      'user.email',
      'user.role',
      'user.tier',
      'user.isBanned',
      'user.createdAt',
      'user.updatedAt',
    ]);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'role', 'tier', 'isBanned', 'createdAt', 'updatedAt'],
      relations: ['todos'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      ...user,
      todosCount: user.todos?.length || 0,
    };
  }

  async updateUserTier(id: string, tier: UserTier) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.tier = tier;
    await this.userRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async banUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.isBanned = true;
    await this.userRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async unbanUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.isBanned = false;
    await this.userRepository.save(user);

    const { password, ...result } = user;
    return result;
  }
}


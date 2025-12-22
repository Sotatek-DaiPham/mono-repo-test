import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo, TodoStatus, TodoPriority } from '../../entities/todo.entity';
import { UserService } from '../user/user.service';
import { getTierRestrictions, canUserPerformAction } from '../../common/utils/tier.utils';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private userService: UserService,
  ) {}

  async findAllByUserId(userId: string): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Todo | null> {
    return this.todoRepository.findOne({
      where: { id, userId },
    });
  }

  async create(
    userId: string,
    todoData: {
      title: string;
      status?: TodoStatus;
      dueDate?: Date | null;
      priority?: TodoPriority | null;
    },
  ): Promise<Todo> {
    // Get user to check tier
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Check tier restrictions
    const restrictions = getTierRestrictions(user.tier);

    // Check max todos limit
    const currentTodosCount = await this.todoRepository.count({
      where: { userId },
    });
    if (currentTodosCount >= restrictions.maxTodos) {
      throw new ForbiddenException(
        `Tier limit reached. Your tier (${user.tier}) allows maximum ${restrictions.maxTodos} todos.`,
      );
    }

    // Check if dueDate is allowed for this tier
    if (todoData.dueDate && !canUserPerformAction(user.tier, 'canSetDueDate')) {
      throw new BadRequestException(
        `Setting due date is not available for ${user.tier} tier. Upgrade to premium or pro.`,
      );
    }

    // Check if priority is allowed for this tier
    if (todoData.priority !== undefined && todoData.priority !== null && !canUserPerformAction(user.tier, 'canSetPriority')) {
      throw new BadRequestException(
        `Setting priority is not available for ${user.tier} tier. Upgrade to pro.`,
      );
    }

    const todo = this.todoRepository.create({
      ...todoData,
      userId,
      status: todoData.status || TodoStatus.TODO,
    });
    return this.todoRepository.save(todo);
  }

  async update(
    id: string,
    userId: string,
    updateData: {
      title?: string;
      status?: TodoStatus;
      dueDate?: Date | null;
      priority?: TodoPriority | null;
    },
  ): Promise<Todo | null> {
    const todo = await this.findOne(id, userId);
    if (!todo) return null;

    // Get user to check tier
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Check if dueDate is allowed for this tier
    if (updateData.dueDate !== undefined && updateData.dueDate !== null && !canUserPerformAction(user.tier, 'canSetDueDate')) {
      throw new BadRequestException(
        `Setting due date is not available for ${user.tier} tier. Upgrade to premium or pro.`,
      );
    }

    // Check if priority is allowed for this tier
    if (updateData.priority !== undefined && updateData.priority !== null && !canUserPerformAction(user.tier, 'canSetPriority')) {
      throw new BadRequestException(
        `Setting priority is not available for ${user.tier} tier. Upgrade to pro.`,
      );
    }

    Object.assign(todo, updateData);
    return this.todoRepository.save(todo);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.todoRepository.delete({ id, userId });
    return result.affected > 0;
  }
}


import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo, TodoStatus } from '../../entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
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
    },
  ): Promise<Todo> {
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
    },
  ): Promise<Todo | null> {
    const todo = await this.findOne(id, userId);
    if (!todo) return null;

    Object.assign(todo, updateData);
    return this.todoRepository.save(todo);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.todoRepository.delete({ id, userId });
    return result.affected > 0;
  }
}


import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../../entities/note.entity';
import { UserService } from '../user/user.service';
import { getTierRestrictions } from '../../common/utils/tier.utils';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    private userService: UserService,
  ) {}

  async findAllByUserId(userId: string, search?: string): Promise<Note[]> {
    const queryBuilder = this.noteRepository.createQueryBuilder('note');

    queryBuilder.where('note.userId = :userId', { userId });

    if (search) {
      queryBuilder.andWhere('note.title ILIKE :search', { search: `%${search}%` });
    }

    queryBuilder.orderBy('note.updatedAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: string, userId: string): Promise<Note | null> {
    return this.noteRepository.findOne({
      where: { id, userId },
    });
  }

  async getNoteCount(userId: string): Promise<number> {
    return this.noteRepository.count({
      where: { userId },
    });
  }

  async create(
    userId: string,
    noteData: {
      title?: string | null;
      content?: string;
    },
  ): Promise<Note> {
    // Get user to check tier
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Check tier restrictions
    const restrictions = getTierRestrictions(user.tier);

    // Check max notes limit
    const currentNotesCount = await this.getNoteCount(userId);
    if (currentNotesCount >= restrictions.maxNotes) {
      throw new ForbiddenException(
        `Tier limit reached. Your tier (${user.tier}) allows maximum ${restrictions.maxNotes === Infinity ? 'unlimited' : restrictions.maxNotes} notes.`,
      );
    }

    const note = this.noteRepository.create({
      title: noteData.title || null,
      content: noteData.content || '',
      userId,
    });

    return this.noteRepository.save(note);
  }

  async update(
    id: string,
    userId: string,
    updateData: {
      title?: string | null;
      content?: string;
    },
  ): Promise<Note | null> {
    const note = await this.findOne(id, userId);
    if (!note) {
      return null;
    }

    if (updateData.title !== undefined) {
      note.title = updateData.title;
    }
    if (updateData.content !== undefined) {
      note.content = updateData.content;
    }

    return this.noteRepository.save(note);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.noteRepository.delete({ id, userId });
    return result.affected > 0;
  }
}


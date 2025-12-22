import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserTier } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: {
    email: string;
    password: string;
    role?: UserRole;
    tier?: UserTier;
  }): Promise<User> {
    const user = this.userRepository.create({
      ...userData,
      role: userData.role || UserRole.USER,
      tier: userData.tier || UserTier.NORMAL,
    });
    return this.userRepository.save(user);
  }
}


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
// import { Todo } from './todo.entity'; // Will be uncommented when Todo entity is created

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserTier {
  NORMAL = 'normal',
  PREMIUM = 'premium',
  PRO = 'pro',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserTier,
    default: UserTier.NORMAL,
  })
  tier: UserTier;

  @Column({ default: false })
  isBanned: boolean;

  // @OneToMany(() => Todo, (todo) => todo.user)
  // todos: Todo[]; // Will be uncommented when Todo entity is created

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from '../../entities/note.entity';
import { UserModule } from '../user/user.module';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), UserModule],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}


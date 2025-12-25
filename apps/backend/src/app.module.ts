import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { UserModule } from './modules/user/user.module';
import { TodoModule } from './modules/todo/todo.module';
import { NoteModule } from './modules/note/note.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { SocketModule } from './modules/socket/socket.module';
import { TimezoneSubscriber } from './common/subscribers/timezone.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'fullstack_crud',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      subscribers: [TimezoneSubscriber],
      extra: {
        // Force PostgreSQL to use UTC timezone for all operations
        // This ensures timestamps are stored and retrieved in UTC
        // The -c flag sets a configuration parameter for this connection
        options: '-c timezone=UTC',
      },
    }),
    UserModule,
    TodoModule,
    NoteModule,
    AuthModule,
    AdminModule,
    SocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


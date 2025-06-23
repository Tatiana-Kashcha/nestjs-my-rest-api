import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Contact } from './contacts/entities/contact.entity';
import { ContactsModule } from './contacts/contacts.module';
import { BackupModule } from './backup/backup.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.SQLITE_DB_PATH || 'phone_book.sqlite',
      entities: [User, Contact],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ContactsModule,
    BackupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

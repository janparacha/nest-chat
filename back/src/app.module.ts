import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { PrismaService } from './prisma/prisma.service';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [AuthModule, UsersModule, ChatModule, MessagesModule],
  providers: [PrismaService],
})
export class AppModule {} 
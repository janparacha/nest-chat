import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [ChatGateway, PrismaService],
})
export class ChatModule {} 
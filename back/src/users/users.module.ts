import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [AuthService],
  exports: [AuthService],
})
export class UsersModule {} 
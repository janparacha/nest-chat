import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(content: string, color: string, userId: number) {
    return this.prisma.message.create({
      data: {
        content,
        color,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.message.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  formatMessage(message: any) {
    return {
      id: message.id,
      content: message.content,
      color: message.color,
      username: message.user.username,
      createdAt: message.createdAt,
    };
  }
} 
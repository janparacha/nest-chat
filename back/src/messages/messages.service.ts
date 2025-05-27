import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getMessages(userId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: userId1 },
              { receiverId: userId2 },
            ],
          },
          {
            AND: [
              { senderId: userId2 },
              { receiverId: userId1 },
            ],
          },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async createMessage(data: {
    content: string;
    color: string;
    senderId: string;
    receiverId: string;
  }) {
    return this.prisma.message.create({
      data,
      include: {
        sender: true,
        receiver: true,
      },
    });
  }
} 
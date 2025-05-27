import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, password: string) {
    try {
      return await this.prisma.user.create({
        data: {
          email,
          password,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        color: true,
        createdAt: true,
      },
    });
    return users;
  }

  async updateColor(id: string, color: string) {
    return this.prisma.user.update({
      where: { id },
      data: { color },
    });
  }
} 
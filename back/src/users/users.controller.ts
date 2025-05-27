import { Controller, Put, Body, UseGuards, Request, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    const user = await this.usersService.findById(req.user.sub);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      color: user.color,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('color')
  async updateColor(@Request() req, @Body() body: { color: string }) {
    return this.usersService.updateColor(req.user.sub, body.color);
  }
} 
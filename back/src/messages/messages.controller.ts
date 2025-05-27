import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(@Request() req) {
    return this.messagesService.getMessages(req.user.id);
  }

  @Get('with/:userId')
  async getMessagesBetweenUsers(@Request() req, @Param('userId') userId: string) {
    return this.messagesService.getMessagesBetweenUsers(req.user.id, userId);
  }
} 
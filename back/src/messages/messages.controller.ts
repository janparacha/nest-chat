import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async findAll() {
    const messages = await this.messagesService.findAll();
    return messages.map(message => this.messagesService.formatMessage(message));
  }

  @Post()
  async create(
    @Body() body: { content: string; color: string; userId: number },
  ) {
    const message = await this.messagesService.create(
      body.content,
      body.color,
      body.userId,
    );
    return this.messagesService.formatMessage(message);
  }
} 
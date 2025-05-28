import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [UsersModule, MessagesModule, WebsocketModule],
})
export class AppModule {} 
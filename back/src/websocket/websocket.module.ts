import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { UsersModule } from '../users/users.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [UsersModule, MessagesModule],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketModule {} 
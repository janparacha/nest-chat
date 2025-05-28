import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { MessagesService } from '../messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('register')
  async handleRegister(
    client: Socket,
    payload: { username: string; email: string; password: string },
  ) {
    const result = await this.authService.register(
      payload.username,
      payload.email,
      payload.password,
    );
    if (result.success) {
      client.data.userId = result.userId;
    }
    return result;
  }

  @SubscribeMessage('login')
  async handleLogin(
    client: Socket,
    payload: { email: string; password: string },
  ) {
    const result = await this.authService.login(payload.email, payload.password);
    if (result.success) {
      client.data.userId = result.userId;
      client.data.username = result.username;
    }
    return result;
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { content: string; color: string },
  ) {
    if (!client.data.userId) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const message = await this.messagesService.create(
        payload.content,
        payload.color,
        client.data.userId,
      );
      const formattedMessage = this.messagesService.formatMessage(message);
      // Envoyer le message à tous les clients SAUF l'expéditeur
      client.broadcast.emit('message', formattedMessage);
      return { success: true, message: formattedMessage };
    } catch (error) {
      return { success: false, error: 'Failed to send message' };
    }
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages() {
    try {
      const messages = await this.messagesService.findAll();
      return messages.map(message => this.messagesService.formatMessage(message));
    } catch (error) {
      return [];
    }
  }
} 
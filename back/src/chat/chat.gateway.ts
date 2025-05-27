import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findById(decoded.sub);
      
      if (!user) {
        client.disconnect();
        return;
      }

      client.data.user = user;
      this.server.emit('userConnected', {
        id: user.id,
        email: user.email,
        color: user.color,
      });
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.data.user) {
      this.server.emit('userDisconnected', {
        id: client.data.user.id,
        email: client.data.user.email,
      });
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: { content: string; receiverId: string; color: string }) {
    const sender = client.data.user;
    if (!sender) return;

    const message = await this.prisma.message.create({
      data: {
        content: payload.content,
        color: payload.color,
        senderId: sender.id,
        receiverId: payload.receiverId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    this.server.emit('newMessage', {
      id: message.id,
      content: message.content,
      color: message.color,
      sender: {
        id: message.sender.id,
        email: message.sender.email,
      },
      receiver: {
        id: message.receiver.id,
        email: message.receiver.email,
      },
      createdAt: message.createdAt,
    });
  }
} 
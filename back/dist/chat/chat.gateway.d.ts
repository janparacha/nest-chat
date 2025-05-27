import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private usersService;
    private prisma;
    server: Server;
    constructor(jwtService: JwtService, usersService: UsersService, prisma: PrismaService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleMessage(client: Socket, payload: {
        content: string;
        receiverId: string;
        color: string;
    }): Promise<void>;
}

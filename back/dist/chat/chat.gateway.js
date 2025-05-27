"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatGateway = class ChatGateway {
    constructor(jwtService, usersService, prisma) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.prisma = prisma;
    }
    async handleConnection(client) {
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
        }
        catch (error) {
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        if (client.data.user) {
            this.server.emit('userDisconnected', {
                id: client.data.user.id,
                email: client.data.user.email,
            });
        }
    }
    async handleMessage(client, payload) {
        const sender = client.data.user;
        if (!sender)
            return;
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
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        prisma_service_1.PrismaService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map
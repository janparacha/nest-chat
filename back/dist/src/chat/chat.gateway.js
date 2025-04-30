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
const user_service_1 = require("../users/user.service");
let ChatGateway = class ChatGateway {
    jwtService;
    userService;
    server;
    constructor(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const decoded = await this.jwtService.verifyAsync(token);
            const user = await this.userService.findOne(decoded.email);
            if (!user) {
                client.disconnect();
                return;
            }
            await this.userService.updateUserStatus(user.id, true);
            client.join('general');
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
        try {
            const token = client.handshake.auth.token;
            if (token) {
                const decoded = await this.jwtService.verifyAsync(token);
                const user = await this.userService.findOne(decoded.email);
                if (user) {
                    await this.userService.updateUserStatus(user.id, false);
                    this.server.emit('userDisconnected', {
                        id: user.id,
                        email: user.email,
                    });
                }
            }
        }
        catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    }
    async handleMessage(client, payload) {
        try {
            console.log('Message reçu sur le serveur:', payload);
            const token = client.handshake.auth.token;
            console.log('Token reçu:', token);
            const decoded = await this.jwtService.verifyAsync(token);
            console.log('Token décodé:', decoded);
            const sender = await this.userService.findOne(decoded.email);
            console.log('Expéditeur trouvé:', sender);
            if (!sender) {
                console.error('Expéditeur non trouvé');
                return;
            }
            console.log('Message reçu de:', sender.email, 'Contenu:', payload.content);
            const receiverId = payload.receiverId === 'general' ? sender.id : payload.receiverId;
            console.log('ReceiverId utilisé:', receiverId);
            const message = await this.userService.createMessage({
                content: payload.content,
                senderId: sender.id,
                receiverId: receiverId,
            });
            console.log('Message créé:', message);
            const messageToEmit = {
                id: message.id,
                content: message.content,
                sender: {
                    id: sender.id,
                    email: sender.email,
                    color: sender.color,
                },
                receiverId: message.receiverId,
                createdAt: message.createdAt,
            };
            console.log('Message à émettre:', messageToEmit);
            this.server.emit('newMessage', messageToEmit);
            console.log('Message émis à tous les clients');
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
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
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map
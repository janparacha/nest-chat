import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
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

      // Mettre à jour le statut en ligne
      await this.userService.updateUserStatus(user.id, true);
      
      // Joindre la room générale
      client.join('general');
      
      // Informer les autres utilisateurs
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
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: { content: string, receiverId: string }) {
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

      // Pour le chat général, on utilise l'ID de l'expéditeur comme receiverId
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
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  }
} 
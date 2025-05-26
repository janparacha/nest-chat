# Documentation Technique - Application de Chat

## Architecture globale

L'application est construite selon une architecture client-serveur moderne :

```
+-----------------+         +------------------+
|                 |  HTTP/  |                  |
|  Frontend React | <-----> |  Backend NestJS  |
|  (Vite)         | WebSocket|                 |
+-----------------+         +------------------+
                                     |
                                     v
                            +------------------+
                            |                  |
                            |  PostgreSQL DB   |
                            |  (Prisma ORM)    |
                            +------------------+
```

## Frontend (React)

### Structure des dossiers

```
front/
├── public/              # Ressources statiques
├── src/
│   ├── assets/          # Images et ressources 
│   ├── components/      # Composants React
│   │   ├── Chat.jsx     # Composant principal de chat
│   │   ├── Login.jsx    # Composant de connexion
│   │   └── Register.jsx # Composant d'inscription
│   ├── App.jsx          # Composant racine de l'application
│   ├── App.css          # Styles CSS principaux
│   ├── index.css        # Styles CSS globaux
│   └── main.jsx         # Point d'entrée de l'application
├── package.json         # Dépendances et scripts
├── README.md            # Documentation générale
└── GUIDE_UTILISATION.md # Guide utilisateur
```

### Composants principaux

#### Chat.jsx

Ce composant gère l'interface de chat principale avec :
- Gestion de la connexion WebSocket
- Affichage et envoi de messages
- Gestion des utilisateurs en ligne
- Détection et affichage des indicateurs de frappe
- Personnalisation de la couleur des bulles

Points clés du code :
- Utilisation de Socket.io pour la communication en temps réel
- Utilisation de hooks React (useState, useEffect, useRef) pour la gestion d'état
- Gestion de l'authentification via JWT stocké dans localStorage

### Configuration WebSocket

```javascript
socketRef.current = io('http://localhost:3000', {
  auth: { token },
  withCredentials: true,
  transports: ['websocket']
});
```

### Événements WebSocket écoutés

```javascript
socketRef.current.on('connect', () => {...});
socketRef.current.on('connect_error', (error) => {...});
socketRef.current.on('userConnected', (user) => {...});
socketRef.current.on('userDisconnected', (user) => {...});
socketRef.current.on('newMessage', (message) => {...});
socketRef.current.on('userTyping', ({ userId, isTyping }) => {...});
```

### Événements WebSocket émis

```javascript
socketRef.current.emit('sendMessage', {...});
socketRef.current.emit('typing', { isTyping: true/false });
```

## Backend (NestJS)

### Structure des dossiers

```
back/
├── prisma/                # Configuration Prisma ORM
│   ├── migrations/        # Migrations de base de données
│   └── schema.prisma      # Schéma de la base de données
├── src/
│   ├── auth/              # Module d'authentification
│   ├── chat/              # Module de chat
│   │   ├── chat.gateway.ts # Passerelle WebSocket
│   │   └── chat.module.ts  # Configuration du module
│   ├── users/             # Module utilisateurs
│   ├── services/          # Services partagés
│   ├── app.controller.ts  # Contrôleur principal
│   ├── app.module.ts      # Module racine
│   └── main.ts            # Point d'entrée
└── package.json           # Dépendances et scripts
```

### Modules principaux

#### ChatGateway

Cette classe gère toutes les communications WebSocket :

```typescript
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // ...
}
```

#### Méthodes principales

- `handleConnection` : Gère la connexion d'un client WebSocket
- `handleDisconnect` : Gère la déconnexion d'un client WebSocket
- `handleMessage` : Traite les messages reçus et les diffuse
- `handleTyping` : Gère les événements de frappe

#### UserService

Service qui gère les utilisateurs et messages :

```typescript
@Injectable()
export class UserService {
  // ...
  
  async createUser(data: CreateUserDto): Promise<UserDto> {...}
  async findOne(email: string, showPassword: boolean = false): Promise<UserDto | null> {...}
  async updateUserStatus(userId: string, isOnline: boolean) {...}
  async updateUserColor(userId: string, color: string) {...}
  async createMessage(data: { content: string; senderId: string; receiverId: string }) {...}
  comparePassword(inputPassword: string, userPassword: string): boolean {...}
}
```

## Base de données

### Modèles de données

#### User

```prisma
model User {
  id               String    @id @default(uuid())
  email            String    @unique
  password         String
  isOnline         Boolean   @default(false)
  color            String    @default("#3498db")
  messagesSent     Message[] @relation("SentMessages")
  messagesReceived Message[] @relation("ReceivedMessages")
  createdAt        DateTime  @default(now())
}
```

#### Message

```prisma
model Message {
  id         String   @id @default(uuid())
  content    String
  sender     User     @relation("SentMessages", fields: [senderId], references: [id])
  senderId   String
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
  receiverId String
  createdAt  DateTime @default(now())
}
```

## Flux de communication

### Authentification

1. L'utilisateur s'inscrit ou se connecte via les formulaires dédiés
2. Le serveur vérifie les identifiants et génère un token JWT
3. Le token est stocké dans le localStorage du client
4. Le token est utilisé pour toutes les requêtes HTTP et WebSocket ultérieures

### Envoi de message

1. L'utilisateur saisit un message et l'envoie
2. Le client émet un événement `sendMessage` avec le contenu du message
3. Le serveur vérifie l'authenticité du token
4. Le serveur enregistre le message en base de données
5. Le serveur émet un événement `newMessage` à tous les clients connectés
6. Les clients reçoivent le message et mettent à jour leur interface

### Notification de frappe

1. L'utilisateur commence à taper un message
2. Le client émet un événement `typing` avec `isTyping: true`
3. Le serveur diffuse un événement `userTyping` aux autres clients
4. Les autres clients affichent l'indicateur de frappe
5. Après un délai d'inactivité, le client émet `typing` avec `isTyping: false`
6. L'indicateur disparaît chez les autres clients

## Sécurité

- Authentification basée sur JWT
- Hachage des mots de passe avec bcrypt
- Validation des entrées utilisateurs
- Protection CORS configurée

## Performance et scalabilité

- Utilisation de WebSockets pour une communication temps réel efficace
- Architecture modulaire pour faciliter les extensions
- Utilisation d'un ORM (Prisma) pour l'abstraction de la base de données

## Dépannage et débogage

### Logs côté serveur

Le serveur génère des logs détaillés pour chaque action :
- Connexion/déconnexion d'utilisateurs
- Envoi/réception de messages
- Erreurs de traitement

### Débogage côté client

La console du navigateur affiche des informations sur :
- État de la connexion WebSocket
- Messages envoyés et reçus
- Erreurs de communication

## Extensions et améliorations possibles

1. **Fonctionnalités**
   - Messages privés entre utilisateurs
   - Salles de discussion thématiques
   - Support pour les médias (images, fichiers)
   - Historique des messages persistant
   
2. **Technique**
   - Améliorer la gestion des déconnexions inattendues
   - Ajouter des tests unitaires et d'intégration
   - Optimiser les performances pour un grand nombre d'utilisateurs
   - Déploiement avec Docker et CI/CD

3. **Sécurité**
   - Ajout d'une authentification à deux facteurs
   - Chiffrement de bout en bout des messages
   - Protection contre les attaques par injection 
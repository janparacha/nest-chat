FROM node:20-alpine

WORKDIR /app

# Installer les dépendances nécessaires pour Prisma
RUN apk add --no-cache openssl openssl-dev

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm install

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste des fichiers
COPY . .

# Compiler le projet
RUN npm run build

EXPOSE 3000

# Script de démarrage qui attend que la base de données soit prête
CMD sh -c "npx prisma migrate dev --name init && npm run start:dev" 
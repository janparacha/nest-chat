FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"] 
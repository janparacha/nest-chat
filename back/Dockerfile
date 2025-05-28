FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

# Attendre que la base de données soit prête
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 3000

CMD ["/wait-for-it.sh", "postgres:5432", "--", "npm", "run", "start:dev"] 
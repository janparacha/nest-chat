FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl openssl-dev

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD sh -c "npx prisma migrate dev --name init && npm run start:dev" 
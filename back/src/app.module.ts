import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { UsersModule } from "./users/users.module";
import { PrismaService } from "./services/prisma.service";

@Module({
    controllers: [AppController],
    providers: [PrismaService],
    imports: [AuthModule, ChatModule, UsersModule],
    exports: [PrismaService],
})
export class AppModule {}

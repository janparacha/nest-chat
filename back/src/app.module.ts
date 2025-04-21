import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./services/prisma.service";
import { UserModule } from "./users/user.module";

@Module({
    controllers: [AppController],
    providers: [PrismaService],
    imports: [UserModule, AuthModule],
    exports: [PrismaService],
})
export class AppModule {}

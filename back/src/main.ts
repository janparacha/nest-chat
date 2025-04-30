import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    
    // Activer CORS
    app.enableCors({
        origin: 'http://localhost:5173', // URL du frontend
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    
    await app.listen(process.env.PORT || 3000);
}
bootstrap();

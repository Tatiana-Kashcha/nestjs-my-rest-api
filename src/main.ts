import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // origin: 'http://localhost:3000', // дозвіл CORS для обраного порта фронтенд-проекта
    origin: true, // дозвіл CORS для всіх портів (з наявністю авторизації, це допустимо)
    credentials: true, // для авторизації
  });

  await app.listen(process.env.PORT ?? 4000); // запускається локально на 4000, а на Render-і отримує автоматично інший порт
}
bootstrap();

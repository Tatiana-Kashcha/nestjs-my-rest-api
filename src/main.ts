import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // дозвіл CORS для порта
    credentials: true, // для авторизації
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

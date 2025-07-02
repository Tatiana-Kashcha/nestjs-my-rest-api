import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/users.module';
import { BackupModule } from './backup/backup.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // origin: 'http://localhost:3000', // дозвіл CORS для обраного порта фронтенд-проекта
    origin: true, // дозвіл CORS для всіх портів (з наявністю авторизації, це допустимо)
    credentials: true, // для авторизації
  });

  app.useGlobalPipes(new ValidationPipe()); // для валідації DTO з class-validator

  // Налаштування Swagger
  const config = new DocumentBuilder()
    .setTitle('Phonebook API')
    .setDescription('API проекту nestjs-my-rest-api')
    .setVersion('1.0')
    .addBearerAuth() // JWT авторизація
    .build();

  // const document = SwaggerModule.createDocument(app, config); // коли для всіх модулей
  // SwaggerModule.setup('api-docs', app, document); // доступ буде на /api-docs коли для всіх модулей

  // Створюємо документацію тільки для потрібних модулів:
  const documentFrontend = SwaggerModule.createDocument(app, config, {
    include: [AuthModule, ContactsModule],
  });

  const documentAdmin = SwaggerModule.createDocument(app, config, {
    include: [UsersModule, BackupModule],
  });

  SwaggerModule.setup('api-docs/frontend', app, documentFrontend); // доступ буде на /api-docs/frontend (для підключення фронтенду)
  SwaggerModule.setup('api-docs/admin', app, documentAdmin); // доступ буде на /api-docs/admin (для службових потреб)

  await app.listen(process.env.PORT ?? 4000); // запускається локально на 4000, а на Render-і отримує автоматично інший порт
}
bootstrap();

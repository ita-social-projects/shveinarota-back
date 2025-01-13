import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('My Project API')
    .setDescription('API Documentation for My Project')
    .setVersion('1.0')
    .addTag('Categories') // Добавьте теги для группировки
    .addBearerAuth() // Если используется авторизация
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Доступ по адресу /api

  await app.listen(3000);
}
bootstrap();

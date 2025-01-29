import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('My Project API')
    .setDescription('API Documentation for My Project')
    .setVersion('1.0')
    .addTag('Markers')  // Исправил тег с 'Categories' на 'Markers'
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Настройки Body Parser
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Включение CORS
  app.enableCors();

  // Включаем глобальную валидацию и преобразование типов
  app.useGlobalPipes(new ValidationPipe({
    transform: true,  // Включаем преобразование типов
    whitelist: true,  // Игнорируем невалидные поля
  }));

  const PORT = configService.get<number>('PORT') || 3007;
  console.log(`🚀 Server running on port ${PORT}`);

  await app.listen(PORT);
}

bootstrap();

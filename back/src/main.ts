import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('My Project API')
    .setDescription('API Documentation for My Project')
    .setVersion('1.0')
    .addTag('Categories')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Middleware для JSON и form-data
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));


  app.enableCors();

  await app.listen(3007);
}
bootstrap();

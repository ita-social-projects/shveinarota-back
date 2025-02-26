import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded, static as serveStatic } from 'express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { User } from './secure/User/entities/user.entity';
import * as bcrypt from 'bcrypt';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const dataSource = app.get(DataSource);

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('My Project API')
    .setDescription('API Documentation for My Project')
    .setVersion('1.0')
    .addTag('Markers')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Настройки Body Parser
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Включение CORS\
  const client = configService.get<string>('client.client');


  app.enableCors({
    origin: ['http://localhost:3000', `${client}`],
    credentials: true,
  });

  // Включаем глобальную валидацию и преобразование типов
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // Раздача статических файлов (доступ к /uploads)
  app.use('/uploads', serveStatic(join(__dirname, '..', 'uploads')));

  // Подключение cookie-parser для работы с куками
  app.use(cookieParser());

  // Создание дефолтного пользователя, если база данных пустая
  const userRepository = dataSource.getRepository(User);
  const userCount = await userRepository.count();

  if (userCount === 0) {
    const defaultUsername = configService.get<string>('DEFAULT_USERNAME') || 'admin';
    const defaultPassword = configService.get<string>('DEFAULT_PASSWORD') || 'admin123';

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const user = userRepository.create({
      username: defaultUsername,
      password: hashedPassword,
    });

    await userRepository.save(user);
  }

  const PORT = configService.get<number>('PORT') || 3007;

  await app.listen(PORT);
}

bootstrap();

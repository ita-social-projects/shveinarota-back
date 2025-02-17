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
import { log } from 'console';

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

  // Включение CORS
  const client = configService.get<string>('CLIENT_NAME')

  app.enableCors({
    origin: 'https://shveinarota.vercel.app',
    credentials: true, // Разрешает куки
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

  // ⚡ Создание дефолтного пользователя, если база данных пустая
  const userRepository = dataSource.getRepository(User);
  const userCount = await userRepository.count();

  if (userCount === 0) {
    const defaultUsername = configService.get<string>('DEFAULT_USERNAME');
    const defaultPassword = configService.get<string>('DEFAULT_PASSWORD');

    if (!defaultUsername || !defaultPassword) {
      throw new Error('⚠️ DEFAULT_USERNAME or DEFAULT_PASSWORD is not set in .env');
    }

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const user = userRepository.create({
      username: defaultUsername,
      password: hashedPassword,
    });

    await userRepository.save(user);
    console.log('✅ Дефолтный пользователь создан:');
  }

  const PORT = configService.get<number>('PORT') || 3007;
  console.log(`🚀 Server running on port ${PORT}`);
  
  

  await app.listen(PORT);
}

bootstrap();

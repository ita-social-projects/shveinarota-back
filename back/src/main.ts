import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Создаём приложение на основе AppModule
  await app.listen(3000); // Запускаем сервер на порту 3000
  console.log('Application is running on http://localhost:3000');
}
bootstrap();

import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.moudle';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static'; // Импортируем модуль для статических файлов
import { join } from 'path'; // Модуль для работы с путями
import { UserModule } from './user/user.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig], // Подгружаем файл конфигурации
      isGlobal: true, // Делаем модуль доступным глобально
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'autorack.proxy.rlwy.net',  // Указываем хост напрямую
      port: 39084,         // Указываем порт напрямую
      username: 'root',   // Указываем имя пользователя напрямую
      password: 'sNrRccvRjaEQVcpmYBqVJaLXkqkwIkiVsNrRccvRjaEQVcpmYBqVJaLXkqkwIkiV',  // Указываем пароль напрямую
      database: 'railway',  // Указываем имя базы данных напрямую
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: true, // Только для разработки
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Указываем путь к папке uploads
      serveRoot: '/uploads', // Указываем префикс для URL
    }),
    AdminModule,
    UserModule,
  ],
})
export class AppModule {}

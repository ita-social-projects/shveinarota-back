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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Только для разработки
      }),
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

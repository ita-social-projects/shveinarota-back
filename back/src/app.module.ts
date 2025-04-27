import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.moudle';
import clientConfig from './config/client.config';
import databaseConfig from './config/database.config';
import googleAuthConfig from './config/OAuth2.0.config';
import { AuthMoudle } from './secure/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, googleAuthConfig, clientConfig], // Загружаем оба конфига
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [__dirname + '/../**/*.entity.js'],
        synchronize: true, // Только для разработки
      }),
      inject: [ConfigService],
    }),
    AdminModule,
    AuthMoudle,
  ],
})
export class AppModule {}

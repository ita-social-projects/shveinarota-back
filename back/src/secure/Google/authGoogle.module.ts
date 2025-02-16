import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGoogleController } from './authGoogle.controller';
import { AuthGoogleService } from './authGoogle.service';
import { AuthGoogleStrategy } from './authGoogle.strategy';
import { JwtStrategy } from '../../common/jwt/authGoogle.strategy';

@Module({
  imports: [
    ConfigModule, // Подключаем глобальный модуль
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.secret');  // Получаем секрет из конфигурации
        if (!secret) {
          throw new Error('JWT_SECRET is not defined');  // Добавляем проверку наличия секрета
        }
        return {
          secret, // Секрет для подписи JWT
          signOptions: { expiresIn: configService.get<string>('jwt.expiresIn', '1h') }, // Время жизни токена
        };
      },
    }),
  ],
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService, AuthGoogleStrategy, JwtStrategy],
})
export class AuthGoogleModule {}

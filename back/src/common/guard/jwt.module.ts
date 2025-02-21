import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule, // Добавляем ConfigModule
    JwtModule.registerAsync({
      imports: [ConfigModule], // Подключаем ConfigModule
      inject: [ConfigService], // Внедряем ConfigService
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'), 
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn', '1h') }, 
      }),
    }),
  ],
  exports: [JwtModule],
})
export class SharedModule {}
